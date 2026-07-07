<?php
$image_id       = $attributes['imageId'] ?? null;
$image_position = $attributes['imagePosition'] ?? 'left';
$layout_ratio   = $attributes['layoutRatio'];
$box_shadow     = ! empty( $attributes['boxShadow'] );

$style = sprintf(
    '--ratio-image:%d%%;--ratio-content:%d%%;',
    $layout_ratio['image'],
    $layout_ratio['content']
);

$classes = 'wp-block-bcew-blocks-media-text-layout is-image-' . $image_position;
if ( $box_shadow ) {
    $classes .= ' has-box-shadow';
}
?>

<div
    class="<?php echo esc_attr( $classes ); ?>"
    style="<?php echo esc_attr( $style ); ?>"
>

    <div class="layout-shell">

        <div class="wp-block-image">
            <?php
            if ( $image_id ) {
                echo wp_get_attachment_image( $image_id, 'large' );
            }
            ?>
        </div>

        <div class="media-text-content">
            <?php echo wp_kses_post( $content ); ?>
        </div>

    </div>

</div>
