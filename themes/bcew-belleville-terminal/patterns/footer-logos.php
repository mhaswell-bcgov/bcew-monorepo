<?php
/**
 * Title: Footer Logos
 * Slug: bcew-belleville-terminal/footer-logos
 * Categories: footer
 * Inserter: true
 *
 * Renders logos from the child theme's assets directory. Using a PHP pattern
 * lets us resolve the asset URL with get_stylesheet_directory_uri() so it works
 * in any environment (template-part HTML files cannot run PHP).
 *
 * @package BcewBellevilleTerminal
 */

$bc_logo_url = get_stylesheet_directory_uri() . '/assets/images/bc_logo.png';
$belleville_logo_url = get_stylesheet_directory_uri() . '/assets/images/belleville_logo.svg';
$canada_logo_url = get_stylesheet_directory_uri() . '/assets/images/canada_logo.png';
$belleville_home_url = home_url( '/' );
?>
<!-- wp:group {"className":"footer-logos","style":{"spacing":{"blockGap":"1rem"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"left","verticalAlignment":"center"}} -->
<div class="wp-block-group footer-logos">
<!-- wp:html -->
<figure class="footer-logo footer-logo-canada"><a href="<?php echo esc_url( $belleville_home_url ); ?>"><img src="<?php echo esc_url( $canada_logo_url ); ?>" alt="<?php echo esc_attr__( 'Government of Canada', 'bc-extended-web-theme' ); ?>" /></a></figure>
<!-- /wp:html -->

<!-- wp:html -->
<figure class="footer-logo footer-logo-bc"><a href="<?php echo esc_url( $belleville_home_url ); ?>"><img src="<?php echo esc_url( $bc_logo_url ); ?>" alt="<?php echo esc_attr__( 'Government of British Columbia', 'bc-extended-web-theme' ); ?>" /></a></figure>
<!-- /wp:html -->

<!-- wp:html -->
<figure class="footer-logo footer-logo-belleville"><a href="<?php echo esc_url( $belleville_home_url ); ?>"><img src="<?php echo esc_url( $belleville_logo_url ); ?>" alt="<?php echo esc_attr__( 'Belleville Terminal Redevelopment', 'bc-extended-web-theme' ); ?>" /></a></figure>
<!-- /wp:html -->
</div>
<!-- /wp:group -->
