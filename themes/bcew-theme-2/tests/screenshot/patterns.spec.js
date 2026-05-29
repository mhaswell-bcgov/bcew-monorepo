import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('pattern', () => {
    test.beforeEach(async ({ admin }) => {
        // Create a new post before each test
        await admin.createNewPost();
    });
});
