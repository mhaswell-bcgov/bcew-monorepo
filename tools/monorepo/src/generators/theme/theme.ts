import { addProjectConfiguration, generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { ThemeGeneratorSchema } from './schema';
import { updateLabeler } from '../helpers';
import { getNextWpEnvPorts } from '../wp-env-ports';

/**
 * Generates a WordPress theme.
 * @param {Tree}                 tree    Filesystem tree.
 * @param {ThemeGeneratorSchema} options Options from schema.json.
 */
export const themeGenerator = ( tree: Tree, options: ThemeGeneratorSchema ) => {
    const slug = options.name
        .toLowerCase()
        .replace( /\s+/g, '-' )
        .replace( /[^a-z0-9-]/g, '' );
    const projectRoot = `themes/${ slug }`;
    const wpEnvPort = options.wpEnvPort ?? getNextWpEnvPorts( tree ).port;
    // Todo: Detect existing project and update instead of initializing new project.
    // @see https://nx.dev/docs/extending-nx/migration-generators
    const phpNamespace = slug
        .split( '-' )
        .map( ( part ) => part.charAt( 0 ).toUpperCase() + part.slice( 1 ) )
        .join( '' );

    addProjectConfiguration( tree, slug, {
        root: projectRoot,
        projectType: 'application',
        sourceRoot: `${ projectRoot }/src`,
        targets: {},
    } );
    generateFiles( tree, path.join( __dirname, 'files' ), projectRoot, {
        ...options,
        slug,
        phpNamespace,
        wpEnvPort,
    } );
    updateLabeler( tree, slug );
};

export default themeGenerator;
