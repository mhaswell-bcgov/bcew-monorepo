/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * @param {Object} props            Save props.
 * @param {Object} props.attributes Persisted attributes.
 * @return {import('react').ReactElement} Element to render.
 */
const save = ( { attributes } ) => {
    const { cardCount } = attributes;
    const blockProps = useBlockProps.save( {
        className: `bcew-blocks-cards bcew-blocks-cards--count-${ cardCount }`,
    } );

    return (
        <div { ...blockProps }>
            <InnerBlocks.Content />
        </div>
    );
};

export default save;
