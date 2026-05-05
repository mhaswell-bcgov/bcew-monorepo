const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' );

test( 'icon-text-block complete e2e flow', async ( {
    admin,
    editor,
    page,
} ) => {
    const BLOCK_NAME = 'bcgov-wordpress-blocks/icon-text-block';
    const BLOCK_CLASS = '.wp-block-bcgov-wordpress-blocks-icon-text-block';

    await admin.createNewPost();
    await editor.insertBlock( { name: BLOCK_NAME } );

    const block = editor.canvas
        .locator( `[data-type="${ BLOCK_NAME }"]` )
        .first()
    await expect( block ).toBeVisible();
    await expect(
        block.locator( '[data-type="bcgov-wordpress-blocks/icon"]' )
    ).toHaveCount( 1 );
    await expect( block.locator( '[data-type="core/heading"]' ) ).toHaveCount(
        1
    );
    await expect( block.locator( '[data-type="core/paragraph"]' ) ).toHaveCount(
        1
    );
    await expect( block.locator( '[data-type="core/list"]' ) ).toHaveCount( 1 );
    await expect(
        block.locator( '[data-type="core/buttons"]' )
    ).toHaveCount( 1 );

    // Reuse icon block controls within the composed block.
    const nestedIconBlock = block
        .locator( '[data-type="bcgov-wordpress-blocks/icon"]' )
        .first();
    await nestedIconBlock.click();
    await expect(
        page.getByText( 'Pick an icon', { exact: true } )
    ).toBeVisible();
    await page.getByPlaceholder( 'Search icons' ).fill( 'arrow-up' );
    await page.getByRole( 'button', { name: 'Arrow Up', exact: true } ).click();
    await expect(
        block.locator( '.wp-block-bcgov-wordpress-blocks-icon i' )
    ).toHaveClass( /fa-arrow-up/ );

    // Switch to second supported layout.
    await page
        .getByRole( 'button', {
            name: /Select parent block: Icon Text Block/i,
        } )
        .click();
    await expect(
        page.getByRole( 'radio', {
            name: 'Icon left, content right',
        } )
    ).toBeVisible();
    await page
        .getByRole( 'radio', {
            name: 'Icon top, content below',
        } )
        .check();
    await expect( block ).toHaveClass( /is-layout-icon-top/ );

    const postId = await editor.publishPost();
    expect( postId ).not.toBeNull();

    await page.goto( `/?p=${ postId }` );

    const frontendBlock = page.locator( BLOCK_CLASS ).first();
    await expect( frontendBlock ).toBeVisible();
    await expect( frontendBlock ).toHaveClass( /is-layout-icon-top/ );
    await expect( frontendBlock.locator( 'i.fa-arrow-up' ) ).toBeVisible();
} );
