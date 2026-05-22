import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import {
    collectWpEnvJsonPaths,
    findHighestWpEnvPort,
    getNextWpEnvPorts,
} from './wp-env-ports';

describe( 'wp-env-ports', () => {
    let tree: Tree;

    beforeEach( () => {
        tree = createTreeWithEmptyWorkspace();
    } );

    it( 'should return default ports when no wp-env configs exist', () => {
        expect( getNextWpEnvPorts( tree ) ).toEqual( {
            port: 9002,
            testsPort: 9003,
        } );
    } );

    it( 'should use the highest port or testsPort from existing configs', () => {
        tree.write(
            'plugins/example/.wp-env.json',
            JSON.stringify( { port: 9002, testsPort: 9003 } )
        );
        tree.write(
            'themes/example/.wp-env.json',
            JSON.stringify( { port: 9006, testsPort: 9007 } )
        );

        expect( findHighestWpEnvPort( tree ) ).toBe( 9007 );
        expect( getNextWpEnvPorts( tree ) ).toEqual( {
            port: 9008,
            testsPort: 9009,
        } );
    } );

    it( 'should collect wp-env configs without descending into node_modules', () => {
        tree.write(
            'plugins/example/.wp-env.json',
            JSON.stringify( { port: 8884, testsPort: 8885 } )
        );
        tree.write(
            'plugins/example/node_modules/pkg/.wp-env.json',
            JSON.stringify( { port: 9999, testsPort: 10000 } )
        );

        expect( collectWpEnvJsonPaths( tree ) ).toEqual( [
            'plugins/example/.wp-env.json',
        ] );
        expect( getNextWpEnvPorts( tree ) ).toEqual( {
            port: 8886,
            testsPort: 8887,
        } );
    } );
} );
