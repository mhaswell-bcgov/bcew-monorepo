<?php
/**
 * Title: Copyright
 * Slug: bcew-belleville-terminal/copyright
 * Categories: footer
 * Inserter: true
 *
 * Outputs the footer copyright line with the current year resolved in PHP.
 * Template-part HTML files cannot run PHP, so a pattern supplies the dynamic
 * year (wp_date() respects the site timezone).
 *
 * @package BcewBellevilleTerminal
 */

?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"0px","bottom":"1rem"}}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group" style="padding-top:0px;padding-bottom:1rem"><!-- wp:paragraph {"align":"left","textColor":"text-color"} -->
<p class="has-text-align-left has-text-color-color has-text-color">&copy; <?php echo esc_html( wp_date( 'Y' ) ); ?> Government of British Columbia</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
