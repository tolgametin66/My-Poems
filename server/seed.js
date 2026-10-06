const { client } = require('./db');

function excerpt(body) {
  return body.slice(0, 120) + (body.length > 120 ? '...' : '');
}

async function seed() {
  const { rows } = await client.execute('SELECT COUNT(*) as count FROM poets');
  if (Number(rows[0].count) > 0) {
    console.log('Database already seeded. Skipping.');
    return;
  }

  const emily = await client.execute({
    sql: 'INSERT INTO poets (name, initials, color, born, died, nationality, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [
      'Emily Dickinson', 'ED', '#9B8DD4', 1830, 1886, 'American',
      'Emily Dickinson was an American poet who lived much of her life in reclusive isolation. Though she produced nearly 1,800 poems, fewer than a dozen were published during her lifetime. Today she is considered one of the most important figures in American poetry.',
    ],
  });
  const emilyId = Number(emily.lastInsertRowid);

  const neruda = await client.execute({
    sql: 'INSERT INTO poets (name, initials, color, born, died, nationality, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [
      'Pablo Neruda', 'PN', '#E07A5F', 1904, 1973, 'Chilean',
      'Pablo Neruda was a Chilean poet-diplomat and politician. He won the Nobel Prize for Literature in 1971. Neruda became known as a poet when he was 13 years old, and wrote in a variety of styles including surrealist poems, historical epics, overtly political manifestos, and passionate love poems.',
    ],
  });
  const nerudaId = Number(neruda.lastInsertRowid);

  const langston = await client.execute({
    sql: 'INSERT INTO poets (name, initials, color, born, died, nationality, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [
      'Langston Hughes', 'LH', '#3D9970', 1902, 1967, 'American',
      'Langston Hughes was an American poet, social activist, novelist, playwright, and columnist. One of the earliest innovators of jazz poetry, Hughes is best known for his work during the Harlem Renaissance. He famously wrote about the joys and hardships of working-class Black Americans.',
    ],
  });
  const langstonId = Number(langston.lastInsertRowid);

  const insertEntry = async (type, title, body, poetId, tags, isFavorite, source, year) => {
    await client.execute({
      sql: 'INSERT INTO entries (type, title, body, excerpt, poet_id, tags, is_favorite, source, year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [type, title, body, excerpt(body), poetId, JSON.stringify(tags), isFavorite ? 1 : 0, source || null, year || null],
    });
  };

  const hopeBody = `"Hope" is the thing with feathers -
That perches in the soul -
And sings the tune without the words -
And never stops - at all -

And sweetest - in the Gale - is heard -
And sore must be the storm -
That could abash the little Bird
That kept so many warm -

I've heard it in the chillest land -
And on the strangest Sea -
Yet - never - in Extremity,
It asked a crumb - of me.`;

  await insertEntry('poem', '"Hope" is the Thing with Feathers', hopeBody, emilyId,
    ['hope', 'nature', 'resilience'], true, 'Poems by Emily Dickinson', 1891);

  const deathBody = `Because I could not stop for Death –
He kindly stopped for me –
The Carriage held but just Ourselves –
And Immortality.

We slowly drove – He knew no haste
And I had put away
My labor and my leisure too,
For His Civility –

We passed the School, where Children strove
At Recess – in the Ring –
We passed the Fields of Gazing Grain –
We passed the Setting Sun –`;

  await insertEntry('poem', 'Because I could not stop for Death', deathBody, emilyId,
    ['death', 'immortality', 'time'], true, 'Poems by Emily Dickinson', 1890);

  await insertEntry('quote', 'On the Experience of Poetry',
    'If I read a book and it makes my whole body so cold no fire can ever warm me, I know that is poetry. If I feel physically as if the top of my head were taken off, I know that is poetry. These are the only ways I know it.',
    emilyId, ['poetry', 'reading', 'craft'], false, null, null);

  const tonightBody = `Tonight I can write the saddest lines.
Write, for example, 'The night is starry,
and the stars, blue, shiver in the distance.'

The night wind revolves in the sky and sings.

Tonight I can write the saddest lines.
I loved her, and sometimes she loved me too.

Through nights like this one I held her in my arms.
I kissed her again and again under the endless sky.
She loved me, sometimes I loved her too.
How could one not have loved her great still eyes.`;

  await insertEntry('poem', 'Tonight I Can Write', tonightBody, nerudaId,
    ['love', 'loss', 'night', 'longing'], true, 'Twenty Love Poems and a Song of Despair', 1924);

  await insertEntry('quote', 'You Can Cut All the Flowers',
    'You can cut all the flowers but you cannot keep spring from coming.',
    nerudaId, ['resilience', 'hope', 'nature'], false, null, null);

  const odaBody = `I want to do with you
what spring does with the cherry trees.

I want you to feel
what the earth feels
when a warm rain falls
and seeds begin to stir
beneath the dark soil.`;

  await insertEntry('poem', 'Ode to the Spring', odaBody, nerudaId,
    ['love', 'nature', 'spring'], false, 'Odes to Common Things', 1954);

  const riversBody = `I've known rivers:
I've known rivers ancient as the world and older than the
     flow of human blood in human veins.

My soul has grown deep like the rivers.

I bathed in the Euphrates when dawns were young.
I built my hut near the Congo and it lulled me to sleep.
I looked upon the Nile and raised the pyramids above it.
I heard the singing of the Mississippi when Abe Lincoln
     went down to New Orleans, and I've seen its muddy
     bosom turn all golden in the sunset.

I've known rivers:
Ancient, dusky rivers.

My soul has grown deep like the rivers.`;

  await insertEntry('poem', 'The Negro Speaks of Rivers', riversBody, langstonId,
    ['identity', 'history', 'soul', 'rivers'], true, 'The Weary Blues', 1926);

  const dreamBody = `What happens to a dream deferred?

      Does it dry up
      like a raisin in the sun?
      Or fester like a sore—
      And then run?
      Does it stink like rotten meat?
      Or crust and sugar over—
      like a syrupy sweet?

      Maybe it just sags
      like a heavy load.

      Or does it explode?`;

  await insertEntry('poem', 'Harlem (A Dream Deferred)', dreamBody, langstonId,
    ['dreams', 'justice', 'harlem', 'America'], true, 'Montage of a Dream Deferred', 1951);

  console.log('Database seeded successfully with 3 poets and 8 entries.');
}

module.exports = seed;
