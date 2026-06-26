import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { PanelBody, RadioControl, ToggleControl } from '@wordpress/components';
import { reconcileOptionalInnerBlocks } from '../utils/optional-inner-blocks';
import './editor.scss';

const CARDS_BLOCK = 'bcew-blocks/cards';

const PARAGRAPH_ATTRS = {
    style: {
        spacing: {
            margin: {
                top: '0rem',
                bottom: '0.5rem',
            },
        },
    },
    lock: {
        move: true,
        remove: true,
    },
};

const LIST_ATTRS = {
    style: {
        typography: {
            lineHeight: '1.688rem',
        },
        spacing: {
            margin: {
                top: '0rem',
                bottom: '1rem',
            },
        },
    },
    lock: {
        move: true,
        remove: true,
    },
};

const INNER_BLOCKS_TEMPLATE = [
    [
        'bcew-blocks/icon',
        {
            lock: {
                move: true,
                remove: true,
            },
        },
    ],
    [
        'core/heading',
        {
            style: {
                spacing: {
                    margin: {
                        top: '0rem',
                        bottom: '0.75rem',
                    },
                },
            },
            lock: {
                move: true,
                remove: true,
            },
        },
    ],
    [ 'core/paragraph', PARAGRAPH_ATTRS ],
    [ 'core/list', LIST_ATTRS ],
    [
        'core/buttons',
        {
            lock: {
                move: true,
                remove: false,
            },
        },
    ],
];

const ALLOWED_BLOCKS = [
    'bcew-blocks/icon',
    'core/heading',
    'core/paragraph',
    'core/list',
    'core/buttons',
];

// Canonical position of every inner block, used to re-insert an optional block
// (paragraph/list) back into its correct slot when it is toggled on again.
const BLOCK_ORDER = {
    'bcew-blocks/icon': 0,
    'core/heading': 1,
    'core/paragraph': 2,
    'core/list': 3,
    'core/buttons': 4,
};

const createParagraph = () => createBlock( 'core/paragraph', PARAGRAPH_ATTRS );
const createList = () =>
    createBlock( 'core/list', LIST_ATTRS, [ createBlock( 'core/list-item' ) ] );

/**
 * @param {Object}   props               Block props.
 * @param {Object}   props.attributes    Persisted attributes.
 * @param {Function} props.setAttributes Updates attributes.
 * @param {string}   props.clientId      Block client ID.
 * @return {import('react').ReactElement} Editor element.
 */
const Edit = ( {
    attributes = {},
    setAttributes = () => {},
    clientId,
} = {} ) => {
    const { layout, boxShadow, showParagraph, showList } = attributes;

    // Inside a Cards block the shadow and content toggles are controlled once
    // at the row level, so the per-block toggles are hidden to keep a single
    // source of truth.
    const isInsideCards = useSelect(
        ( select ) =>
            select( blockEditorStore ).getBlockParentsByBlockName(
                clientId,
                CARDS_BLOCK
            ).length > 0,
        [ clientId ]
    );

    const innerBlocks = useSelect(
        ( select ) => select( blockEditorStore ).getBlocks( clientId ),
        [ clientId ]
    );
    const { replaceInnerBlocks } = useDispatch( blockEditorStore );

    // Add/remove the optional paragraph and list so they are truly absent from
    // the saved content (and thus the front end) when toggled off.
    useEffect( () => {
        // Wait until the inner-block template has populated. On first render the
        // inner blocks are momentarily empty (before the template seeds them);
        // acting then would replace the whole set with just paragraph/list and
        // clobber the icon/heading/buttons. The heading is always present, so
        // use it as the "template ready" signal.
        if (
            ! innerBlocks.some( ( block ) => 'core/heading' === block.name )
        ) {
            return;
        }
        const next = reconcileOptionalInnerBlocks( {
            blocks: innerBlocks,
            optional: {
                'core/paragraph': {
                    show: false !== showParagraph,
                    create: createParagraph,
                },
                'core/list': {
                    show: false !== showList,
                    create: createList,
                },
            },
            order: BLOCK_ORDER,
        } );
        if ( next ) {
            replaceInnerBlocks( clientId, next, false );
        }
    }, [ showParagraph, showList, innerBlocks, clientId, replaceInnerBlocks ] );

    const supportedLayouts = [ 'icon-left', 'icon-top' ];
    const normalizedLayout = supportedLayouts.includes( layout )
        ? layout
        : 'icon-left';
    const layoutClass = `is-layout-${ normalizedLayout }`;
    const shadowClass = boxShadow ? ' has-box-shadow' : '';

    const blockProps = useBlockProps( {
        className: `bcgov-wp-blocks-icon-text-block ${ layoutClass }${ shadowClass }`,
    } );

    const innerBlocksProps = useInnerBlocksProps(
        {
            className: 'bcgov-wp-blocks-icon-text-block__layout-shell',
        },
        {
            template: INNER_BLOCKS_TEMPLATE,
            allowedBlocks: ALLOWED_BLOCKS,
            templateLock: 'insert',
        }
    );

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Layout', 'bcew-blocks' ) } initialOpen>
                    <RadioControl
                        label={ __( 'Icon/Text arrangement', 'bcew-blocks' ) }
                        selected={ layout }
                        options={ [
                            {
                                label: __(
                                    'Icon left, content right',
                                    'bcew-blocks'
                                ),
                                value: 'icon-left',
                            },
                            {
                                label: __(
                                    'Icon top, content below',
                                    'bcew-blocks'
                                ),
                                value: 'icon-top',
                            },
                        ] }
                        onChange={ ( value ) =>
                            setAttributes( { layout: value } )
                        }
                    />
                </PanelBody>
                { ! isInsideCards && (
                    <PanelBody
                        title={ __( 'Style', 'bcew-blocks' ) }
                        initialOpen={ false }
                    >
                        <ToggleControl
                            __nextHasNoMarginBottom
                            label={ __( 'Box shadow', 'bcew-blocks' ) }
                            help={ __(
                                'Add a drop shadow around the block.',
                                'bcew-blocks'
                            ) }
                            checked={ !! boxShadow }
                            onChange={ ( value ) =>
                                setAttributes( { boxShadow: value } )
                            }
                        />
                    </PanelBody>
                ) }
                { ! isInsideCards && (
                    <PanelBody
                        title={ __( 'Content', 'bcew-blocks' ) }
                        initialOpen={ false }
                    >
                        <ToggleControl
                            __nextHasNoMarginBottom
                            label={ __( 'Show paragraph', 'bcew-blocks' ) }
                            help={ __(
                                'Turn off to remove the paragraph from this block.',
                                'bcew-blocks'
                            ) }
                            checked={ false !== showParagraph }
                            onChange={ ( value ) =>
                                setAttributes( { showParagraph: value } )
                            }
                        />
                        <ToggleControl
                            __nextHasNoMarginBottom
                            label={ __( 'Show list', 'bcew-blocks' ) }
                            help={ __(
                                'Turn off to remove the list from this block.',
                                'bcew-blocks'
                            ) }
                            checked={ false !== showList }
                            onChange={ ( value ) =>
                                setAttributes( { showList: value } )
                            }
                        />
                    </PanelBody>
                ) }
            </InspectorControls>
            <div { ...blockProps }>
                <div { ...innerBlocksProps } />
            </div>
        </>
    );
};

export default Edit;
