import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    useBlockProps,
    useInnerBlocksProps,
    store as blockEditorStore,
} from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { PanelBody, RadioControl, ToggleControl } from '@wordpress/components';
import './editor.scss';

const CARDS_BLOCK = 'bcew-blocks/cards';

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
    [
        'core/paragraph',
        {
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
        },
    ],
    [
        'core/list',
        {
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
        },
    ],
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
    const { layout, boxShadow } = attributes;

    // Inside a Cards block the shadow is controlled once at the row level, so
    // the per-block toggle is hidden to keep a single source of truth.
    const isInsideCards = useSelect(
        ( select ) =>
            select( blockEditorStore ).getBlockParentsByBlockName(
                clientId,
                CARDS_BLOCK
            ).length > 0,
        [ clientId ]
    );

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
            </InspectorControls>
            <div { ...blockProps }>
                <div { ...innerBlocksProps } />
            </div>
        </>
    );
};

export default Edit;
