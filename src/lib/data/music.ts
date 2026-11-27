export interface FavoriteTrack {
  title: string;
  artist: string;
  album?: string;
}

export interface MusicCategory {
  name: string;
  tracks: readonly FavoriteTrack[];
}

export const MUSIC_CATEGORIES: readonly MusicCategory[] = [
  {
    name: 'Lana Del Rey',
    tracks: [
      {
        title: 'Video Games',
        artist: 'Lana Del Rey',
        album: 'Born to Die',
      },
      {
        title: 'Born To Die',
        artist: 'Lana Del Rey',
        album: 'Born to Die',
      },
      {
        title: 'Dark Paradise',
        artist: 'Lana Del Rey',
        album: 'Born to Die',
      },
      {
        title: 'Diet Mountain Dew',
        artist: 'Lana Del Rey',
        album: 'Born to Die',
      },
      {
        title: 'Summertime Sadness',
        artist: 'Lana Del Rey',
        album: 'Born to Die',
      },
      {
        title: 'Young And Beautiful',
        artist: 'Lana Del Rey',
        album: 'The Great Gatsby',
      },
      {
        title: 'West Coast',
        artist: 'Lana Del Rey',
        album: 'Ultraviolence',
      },
      {
        title: 'Art Deco',
        artist: 'Lana Del Rey',
        album: 'Honeymoon',
      },
      {
        title: 'Salvatore',
        artist: 'Lana Del Rey',
        album: 'Honeymoon',
      },
      {
        title: 'White Mustang',
        artist: 'Lana Del Rey',
        album: 'Lust for Life',
      },
      {
        title: 'Cinnamon Girl',
        artist: 'Lana Del Rey',
        album: 'Norman Fucking Rockwell!',
      },
      {
        title: 'Say Yes To Heaven',
        artist: 'Lana Del Rey',
        album: 'Say Yes To Heaven - Single',
      },
      {
        title: 'Crazy For You',
        artist: 'Lana Del Rey',
      },
    ],
  },
  {
    name: 'Late Night & Indie',
    tracks: [
      {
        title: 'Apocalypse',
        artist: 'Cigarettes After Sex',
        album: 'Cigarettes After Sex',
      },
      {
        title: 'Sunsetz',
        artist: 'Cigarettes After Sex',
        album: 'Cigarettes After Sex',
      },
      {
        title: 'Sweater Weather',
        artist: 'The Neighbourhood',
        album: 'I Love You.',
      },
      {
        title: 'Reflections',
        artist: 'The Neighbourhood',
        album: 'Hard To Imagine The Neighbourhood Ever Changing',
      },
      {
        title: 'Fourth Of July',
        artist: 'Sufjan Stevens',
        album: 'Carrie & Lowell',
      },
      {
        title: 'Mystery Of Love',
        artist: 'Sufjan Stevens',
        album: 'Call Me By Your Name',
      },
      {
        title: 'The Night We Met',
        artist: 'Lord Huron',
        album: 'Strange Trails',
      },
      {
        title: 'Those Eyes',
        artist: 'New West',
        album: 'Those Eyes - Single',
      },
    ],
  },
  {
    name: 'Pop & Alt Classics',
    tracks: [
      {
        title: 'Birds Of A Feather',
        artist: 'Billie Eilish',
        album: 'HIT ME HARD AND SOFT',
      },
      {
        title: 'Something Just Like This',
        artist: 'The Chainsmokers & Coldplay',
        album: 'Memories...Do Not Open',
      },
      {
        title: 'Running Up That Hill',
        artist: 'Kate Bush',
        album: 'Hounds of Love',
      },
      {
        title: 'Iris',
        artist: 'The Goo Goo Dolls',
        album: 'Dizzy Up the Girl',
      },
      {
        title: 'Golden Brown',
        artist: 'The Stranglers',
        album: 'La Folie',
      },
      {
        title: 'My Life Is Going On',
        artist: 'Cecilia Krull',
        album: 'My Life Is Going On',
      },
      {
        title: 'Gravity',
        artist: 'Leo Stannard & Frances',
        album: 'Gravity - Single',
      },
    ],
  },
  {
    name: 'Harris Jayaraj',
    tracks: [
      {
        title: 'Annul Maelae',
        artist: 'Harris Jayaraj',
        album: 'Vaaranam Aayiram',
      },
      {
        title: 'Nenjukkul Peidhidum',
        artist: 'Harris Jayaraj',
        album: 'Vaaranam Aayiram',
      },
      {
        title: 'Adiyae Kolluthey',
        artist: 'Harris Jayaraj',
        album: 'Vaaranam Aayiram',
      },
      {
        title: 'Anbe En Anbe',
        artist: 'Harris Jayaraj & Harish Raghavendra',
        album: 'Dhaam Dhoom',
      },
      {
        title: 'Unakkul Naane',
        artist: 'Harris Jayaraj & Bombay Jayashri',
        album: 'Patchai Kili Muthucharam',
      },
    ],
  },
  {
    name: 'South & Soulful',
    tracks: [
      {
        title: 'Soul Of Dia',
        artist: 'Sanjith Hegde & Chinmayi Sripada',
        album: 'Soul Of Dia (From "Dia") - Single',
      },
      {
        title: 'Neeve',
        artist: 'Yazin Nizar',
        album: 'Neeve (Reprise) - Single',
      },
      {
        title: 'Mere Humsafar',
        artist: 'Yashal Shahid',
        album: 'Mere Humsafar (Original Score) [Female Version] - Single',
      },
      {
        title: 'Rathinamo',
        artist: 'Saurav Srisan & Tanisha Gnanavel',
        album: 'Rathinamo (Female Version) - Single',
      },
    ],
  },
];
