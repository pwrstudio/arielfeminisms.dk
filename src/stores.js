import { writable, derived } from 'svelte/store'
// import get from 'lodash/get'
// import kebabCase from 'lodash/kebabCase'

// *** GLOBALS

export const isAriel = writable('true')
export const isAri = writable('false')
export const isYGRG = writable('false')


// export const isArabic = derived(
//     globalLanguage,
//     $globalLanguage => $globalLanguage === 'arabic'
// )


// export const navigationColor = derived(
//     [activeNavigation, categoryList, isTileView],
//     ([$activeNavigation, $categoryList, $isTileView]) => {
//         if ($isTileView) return 'rfgen-white'
//         return get(
//             $categoryList.find(c => c.categorySlug === kebabCase($activeNavigation)),
//             'color',
//             'rfgen-white'
//         )
//     }
// )