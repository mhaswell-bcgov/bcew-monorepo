import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * The block is dynamic (see render.php), which wraps this content in
 * `.media-text-content`. A single `.inner-blocks` wrapper is enough; the block
 * wrapper attributes (anchor, colour, spacing) ride on it via useBlockProps.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 * @return {Element} Element to render.
 */
const save = () => {
    const blockProps = useBlockProps.save( { className: 'inner-blocks' } );

    return (
        <div { ...blockProps }>
            <InnerBlocks.Content />
        </div>
    );
};

export default save;
