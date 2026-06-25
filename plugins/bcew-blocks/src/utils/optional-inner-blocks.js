/**
 * Helpers for showing/hiding optional inner blocks (e.g. paragraph, list)
 * based on a block's attributes.
 *
 * Hidden blocks are genuinely removed from the inner-block list rather than
 * hidden with CSS, so they never reach `post_content` and are absent from the
 * front-end DOM. Re-enabling a block inserts a fresh, empty one.
 */

/**
 * @typedef {Object} OptionalBlockConfig
 * @property {boolean}  show   Whether the block should be present.
 * @property {Function} create Factory returning a fresh block when re-enabled.
 */

/**
 * Reconciles a block's current inner blocks against a set of optional blocks.
 *
 * Returns a new, correctly ordered inner-block array when a change is needed,
 * or `null` when the current blocks already match the desired state (so callers
 * can avoid a redundant dispatch).
 *
 * @param {Object}                              params          Parameters.
 * @param {Object[]}                            params.blocks   Current inner blocks.
 * @param {Object<string, OptionalBlockConfig>} params.optional Map of block name to config.
 * @param {Object<string, number>}              params.order    Map of block name to sort index.
 *
 * @return {Object[]|null} The next inner-block array, or null when unchanged.
 */
export const reconcileOptionalInnerBlocks = ( { blocks, optional, order } ) => {
    let changed = false;

    const kept = blocks.filter( ( block ) => {
        const config = optional[ block.name ];
        if ( config && ! config.show ) {
            changed = true;
            return false;
        }
        return true;
    } );

    Object.entries( optional ).forEach( ( [ name, config ] ) => {
        if ( config.show && ! kept.some( ( block ) => block.name === name ) ) {
            kept.push( config.create() );
            changed = true;
        }
    } );

    if ( ! changed ) {
        return null;
    }

    return kept.sort(
        ( a, b ) => ( order[ a.name ] ?? 99 ) - ( order[ b.name ] ?? 99 )
    );
};
