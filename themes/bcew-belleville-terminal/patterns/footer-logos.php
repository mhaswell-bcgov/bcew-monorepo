<?php
/**
 * Title: Footer Logos
 * Slug: bcew-belleville-terminal/footer-logos
 * Inserter: false
 *
 * Renders logos from the child theme's assets directory. Using a PHP pattern
 * lets us resolve the asset URL with get_stylesheet_directory_uri() so it works
 * in any environment (template-part HTML files cannot run PHP).
 *
 * @package BcewBellevilleTerminal
 */

$bc_logo_url     = get_stylesheet_directory_uri() . '/assets/images/bc_logo.png';
$ti_logo_url     = get_stylesheet_directory_uri() . '/assets/images/ti_logo.png';
$canada_logo_url = get_stylesheet_directory_uri() . '/assets/images/canada_logo.png';
?>
<!-- wp:group {"className":"footer-logos","style":{"spacing":{"blockGap":"1rem"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"left","verticalAlignment":"center"}} -->
<div class="wp-block-group footer-logos">
    <!-- wp:image {"width":"145px","sizeSlug":"full","className":"footer-logo footer-logo-canada"} -->
    <figure class="wp-block-image size-full is-resized footer-logo footer-logo-canada"
        ><img
            src="<?php echo esc_url( $canada_logo_url ); ?>"
            alt="<?php echo esc_attr__( 'Government of Canada', 'bc-extended-web-theme' ); ?>"
            style="width: 145px" /
    ></figure>
    <!-- /wp:image -->

    <!-- wp:image {"width":"146px","sizeSlug":"full","className":"footer-logo footer-logo-bc"} -->
    <figure class="wp-block-image size-full is-resized footer-logo footer-logo-bc"
        ><img
            src="<?php echo esc_url( $bc_logo_url ); ?>"
            alt="<?php echo esc_attr__( 'Government of British Columbia', 'bc-extended-web-theme' ); ?>"
            style="width: 146px" /
    ></figure>
    <!-- /wp:image -->

    <!-- wp:image {"width":"145px","sizeSlug":"full","className":"footer-logo footer-logo-ti"} -->
    <figure class="wp-block-image size-full is-resized footer-logo footer-logo-ti"
        ><img
            src="<?php echo esc_url( $ti_logo_url ); ?>"
            alt="<?php echo esc_attr__( 'TI Corporation', 'bc-extended-web-theme' ); ?>"
            style="width: 145px" /
    ></figure>
    <!-- /wp:image -->
</div>
<!-- /wp:group -->
