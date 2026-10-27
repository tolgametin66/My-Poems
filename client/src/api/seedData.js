export const SEED_POETS = [
  {
    "name": "Emily Dickinson",
    "initials": "ED",
    "color": "#9B8DD4",
    "born": 1830,
    "died": 1886,
    "nationality": "American",
    "bio": "Emily Dickinson was an American poet who lived much of her life in reclusive isolation. Though she produced nearly 1,800 poems, fewer than a dozen were published during her lifetime. Today she is considered one of the most important figures in American poetry."
  },
  {
    "name": "Pablo Neruda",
    "initials": "PN",
    "color": "#E07A5F",
    "born": 1904,
    "died": 1973,
    "nationality": "Chilean",
    "bio": "Pablo Neruda was a Chilean poet-diplomat and politician. He won the Nobel Prize for Literature in 1971. Neruda became known as a poet when he was 13 years old, and wrote in a variety of styles including surrealist poems, historical epics, overtly political manifestos, and passionate love poems."
  },
  {
    "name": "Langston Hughes",
    "initials": "LH",
    "color": "#3D9970",
    "born": 1902,
    "died": 1967,
    "nationality": "American",
    "bio": "Langston Hughes was an American poet, social activist, novelist, playwright, and columnist. One of the earliest innovators of jazz poetry, Hughes is best known for his work during the Harlem Renaissance. He famously wrote about the joys and hardships of working-class Black Americans."
  }
];

// `poet` is an index into SEED_POETS
export const SEED_ENTRIES = [
  {
    "type": "poem",
    "title": "\"Hope\" is the Thing with Feathers",
    "body": "\"Hope\" is the thing with feathers -\nThat perches in the soul -\nAnd sings the tune without the words -\nAnd never stops - at all -\n\nAnd sweetest - in the Gale - is heard -\nAnd sore must be the storm -\nThat could abash the little Bird\nThat kept so many warm -\n\nI've heard it in the chillest land -\nAnd on the strangest Sea -\nYet - never - in Extremity,\nIt asked a crumb - of me.",
    "poet": 0,
    "tags": [
      "hope",
      "nature",
      "resilience"
    ],
    "is_favorite": true,
    "source": "Poems by Emily Dickinson",
    "year": 1891
  },
  {
    "type": "poem",
    "title": "Because I could not stop for Death",
    "body": "Because I could not stop for Death –\nHe kindly stopped for me –\nThe Carriage held but just Ourselves –\nAnd Immortality.\n\nWe slowly drove – He knew no haste\nAnd I had put away\nMy labor and my leisure too,\nFor His Civility –\n\nWe passed the School, where Children strove\nAt Recess – in the Ring –\nWe passed the Fields of Gazing Grain –\nWe passed the Setting Sun –",
    "poet": 0,
    "tags": [
      "death",
      "immortality",
      "time"
    ],
    "is_favorite": true,
    "source": "Poems by Emily Dickinson",
    "year": 1890
  },
  {
    "type": "quote",
    "title": "On the Experience of Poetry",
    "body": "If I read a book and it makes my whole body so cold no fire can ever warm me, I know that is poetry. If I feel physically as if the top of my head were taken off, I know that is poetry. These are the only ways I know it.",
    "poet": 0,
    "tags": [
      "poetry",
      "reading",
      "craft"
    ],
    "is_favorite": false,
    "source": null,
    "year": null
  },
  {
    "type": "poem",
    "title": "Tonight I Can Write",
    "body": "Tonight I can write the saddest lines.\nWrite, for example, 'The night is starry,\nand the stars, blue, shiver in the distance.'\n\nThe night wind revolves in the sky and sings.\n\nTonight I can write the saddest lines.\nI loved her, and sometimes she loved me too.\n\nThrough nights like this one I held her in my arms.\nI kissed her again and again under the endless sky.\nShe loved me, sometimes I loved her too.\nHow could one not have loved her great still eyes.",
    "poet": 1,
    "tags": [
      "love",
      "loss",
      "night",
      "longing"
    ],
    "is_favorite": true,
    "source": "Twenty Love Poems and a Song of Despair",
    "year": 1924
  },
  {
    "type": "quote",
    "title": "You Can Cut All the Flowers",
    "body": "You can cut all the flowers but you cannot keep spring from coming.",
    "poet": 1,
    "tags": [
      "resilience",
      "hope",
      "nature"
    ],
    "is_favorite": false,
    "source": null,
    "year": null
  },
  {
    "type": "poem",
    "title": "Ode to the Spring",
    "body": "I want to do with you\nwhat spring does with the cherry trees.\n\nI want you to feel\nwhat the earth feels\nwhen a warm rain falls\nand seeds begin to stir\nbeneath the dark soil.",
    "poet": 1,
    "tags": [
      "love",
      "nature",
      "spring"
    ],
    "is_favorite": false,
    "source": "Odes to Common Things",
    "year": 1954
  },
  {
    "type": "poem",
    "title": "The Negro Speaks of Rivers",
    "body": "I've known rivers:\nI've known rivers ancient as the world and older than the\n     flow of human blood in human veins.\n\nMy soul has grown deep like the rivers.\n\nI bathed in the Euphrates when dawns were young.\nI built my hut near the Congo and it lulled me to sleep.\nI looked upon the Nile and raised the pyramids above it.\nI heard the singing of the Mississippi when Abe Lincoln\n     went down to New Orleans, and I've seen its muddy\n     bosom turn all golden in the sunset.\n\nI've known rivers:\nAncient, dusky rivers.\n\nMy soul has grown deep like the rivers.",
    "poet": 2,
    "tags": [
      "identity",
      "history",
      "soul",
      "rivers"
    ],
    "is_favorite": true,
    "source": "The Weary Blues",
    "year": 1926
  },
  {
    "type": "poem",
    "title": "Harlem (A Dream Deferred)",
    "body": "What happens to a dream deferred?\n\n      Does it dry up\n      like a raisin in the sun?\n      Or fester like a sore—\n      And then run?\n      Does it stink like rotten meat?\n      Or crust and sugar over—\n      like a syrupy sweet?\n\n      Maybe it just sags\n      like a heavy load.\n\n      Or does it explode?",
    "poet": 2,
    "tags": [
      "dreams",
      "justice",
      "harlem",
      "America"
    ],
    "is_favorite": true,
    "source": "Montage of a Dream Deferred",
    "year": 1951
  }
];
