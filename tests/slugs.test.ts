import { EntrySlugEntity, RatingSlugEntity, RootSlugEntity, SlugAction, SlugVerb } from '../utils/types'


interface Case {
  path: string
  input: undefined | string | string[]
  output: SlugAction
}


// 'main/entries': {},
// 'main/entries/create': {},
// 'main/entries/entryId': {},
// 'main/entries/entryId/edit': {},
// 'main/entries/entryId/ratings': {},
// 'main/entries/entryId/ratings/create': {},
// 'main/entries/entryId/ratings/commentId': {},
// 'main/entries/entryId/ratings/commentId/replies': {},
// 'main/entries/entryId/ratings/commentId/replies/create': {},

const cases: Case[] = [
  {
    path: '',
    input: undefined,
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: null,
      parentSlugAction: null,
    },
  },
  {
    path: '/',
    input: undefined,
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: null,
      parentSlugAction: null,
    },
  },
  {
    path: 'main',
    input: 'main',
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: null,
      parentSlugAction: null,
    },
  },
  {
    path: 'main/invalidEntity',
    input: 'main/invalidEntity',
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: null,
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries',
    input: 'main/entries'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        verb: SlugVerb.SHOW,
        entity: RootSlugEntity.ENTRY,
        id: null,
        subSlugAction: null,
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/events',
    input: 'main/events'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        verb: SlugVerb.SHOW,
        entity: RootSlugEntity.EVENT,
        id: null,
        subSlugAction: null,
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/invalidEntity',
    input: 'main/invalidEntity'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: null,
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/create',
    input: 'main/entries/create'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.CREATE,
        id: null,
        subSlugAction: null,
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/create/invalidEntryId',
    input: 'main/entries/create/invalidEntryId'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.CREATE,
        id: null,
        subSlugAction: null,
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId',
    input: 'main/entries/entryId'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.SHOW,
        id: 'entryId',
        subSlugAction: null,
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId/edit',
    input: 'main/entries/entryId/edit'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.EDIT,
        id: 'entryId',
        subSlugAction: null,
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId/invalidAction',
    input: 'main/entries/entryId/invalidAction'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.SHOW,
        id: 'entryId',
        subSlugAction: null,
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId/ratings',
    input: 'main/entries/entryId/ratings'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.SHOW,
        id: 'entryId',
        subSlugAction: {
          entity: EntrySlugEntity.RATING,
          verb: SlugVerb.SHOW,
          id: null,
          subSlugAction: null,
          parentSlugAction: null,
        },
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId/ratings/create',
    input: 'main/entries/entryId/ratings/create'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.SHOW,
        id: 'entryId',
        subSlugAction: {
          entity: EntrySlugEntity.RATING,
          verb: SlugVerb.CREATE,
          id: null,
          subSlugAction: null,
          parentSlugAction: null,
        },
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId/ratings/ratingId',
    input: 'main/entries/entryId/ratings/ratingId'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.SHOW,
        id: 'entryId',
        subSlugAction: {
          entity: EntrySlugEntity.RATING,
          verb: SlugVerb.SHOW,
          id: 'ratingId',
          subSlugAction: null,
          parentSlugAction: null,
        },
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId/ratings/ratingId/edit',
    input: 'main/entries/entryId/ratings/ratingId/edit'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.SHOW,
        id: 'entryId',
        subSlugAction: {
          entity: EntrySlugEntity.RATING,
          verb: SlugVerb.EDIT,
          id: 'ratingId',
          subSlugAction: null,
          parentSlugAction: null,
        },
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId/ratings/ratingId/replies',
    input: 'main/entries/entryId/ratings/ratingId/replies'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.SHOW,
        id: 'entryId',
        subSlugAction: {
          entity: EntrySlugEntity.RATING,
          verb: SlugVerb.SHOW,
          id: 'ratingId',
          subSlugAction: {
            entity: RatingSlugEntity.COMMENT,
            verb: SlugVerb.SHOW,
            id: null,
            subSlugAction: null,
            parentSlugAction: null,
          },
          parentSlugAction: null,
        },
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId/ratings/ratingId/replies/create',
    input: 'main/entries/entryId/ratings/ratingId/replies/create'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.SHOW,
        id: 'entryId',
        subSlugAction: {
          entity: EntrySlugEntity.RATING,
          verb: SlugVerb.SHOW,
          id: 'ratingId',
          subSlugAction: {
            entity: RatingSlugEntity.COMMENT,
            verb: SlugVerb.CREATE,
            id: null,
            subSlugAction: null,
            parentSlugAction: null,
          },
          parentSlugAction: null,
        },
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId/ratings/ratingId/replies/replyId',
    input: 'main/entries/entryId/ratings/ratingId/replies/replyId'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.SHOW,
        id: 'entryId',
        subSlugAction: {
          entity: EntrySlugEntity.RATING,
          verb: SlugVerb.SHOW,
          id: 'ratingId',
          subSlugAction: {
            entity: RatingSlugEntity.COMMENT,
            verb: SlugVerb.SHOW,
            id: 'replyId',
            subSlugAction: null,
            parentSlugAction: null,
          },
          parentSlugAction: null,
        },
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
  {
    path: 'main/entries/entryId/ratings/ratingId/replies/replyId/create',
    input: 'main/entries/entryId/ratings/ratingId/replies/replyId/edit'.split('/'),
    output: {
      verb: SlugVerb.SHOW,
      entity: RootSlugEntity.RESULT,
      id: null,
      subSlugAction: {
        entity: RootSlugEntity.ENTRY,
        verb: SlugVerb.SHOW,
        id: 'entryId',
        subSlugAction: {
          entity: EntrySlugEntity.RATING,
          verb: SlugVerb.SHOW,
          id: 'ratingId',
          subSlugAction: {
            entity: RatingSlugEntity.COMMENT,
            verb: SlugVerb.EDIT,
            id: 'replyId',
            subSlugAction: null,
            parentSlugAction: null,
          },
          parentSlugAction: null,
        },
        parentSlugAction: null,
      },
      parentSlugAction: null,
    },
  },
]


describe('convert query slugs to slug actions', () => {
  // todo: the test is broken since the slug actions are now a doubled linked list and parents should has values
  // test.each(cases)(
  //   '$path',
  //   ({ path, input, output }) => {
  //     expect(getRootSlugActionFromQuery({ slug: input })).toEqual(output)
  //   })
})