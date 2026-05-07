<?php
$image_id       = $attributes['imageId'] ?? null;
$image_position = $attributes['imagePosition'] ?? 'left';
?>

<div class="
<?php
echo esc_attr(
    'wp-block-bcgov-wordpress-blocks-media-text-layout is-image-' . $image_position
);
?>
">

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