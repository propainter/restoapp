const usersCred = {
    userone: {
      email: 'userone@gmail.com',
      password: 'userone',
      image: ['./test/files/avatar/avatar2.png', 'avatar2.png'],
      name: 'userone',
      role: 'USER',
    },
    usertwo: {
      email: 'usertwo@gmail.com',
      password: 'usertwo',
      image: ['./test/files/avatar/avatar1.png', 'avatar1.png'],
      name: 'usertwo',
      role: 'USER',
    },
    admin: {
      email: 'admin@gmail.com',
      password: 'admin123',
      image: ['./test/files/avatar/avatar3.png', 'avatar3.png'],
      name: 'admin',
      role: 'ADMIN',
    },
    ownerone: {
      email: 'ownerone@gmail.com',
      password: 'ownerone',
      image: ['./test/files/avatar/avatar4.png', 'avatar4.png'],
      name: 'ownerone',
      role: 'OWNER',
    },
    ownertwo: {
      email: 'ownertwo@gmail.com',
      password: 'ownertwo',
      image: ['./test/files/avatar/avatar5.png', 'avatar5.png'],
      name: 'ownertwo',
      role: 'OWNER',
    },
  }
const places = {
  userone: [{
    title: 'Villa Shanti',
    description: 'descriptoin1',
    address: 'Nehru Place, New Delhi, India',
    image: ['./test/files/resto/resto01.jpeg', 'resto01.jpeg']
  },{
    title: 'The Water Front',
    description: 'descriptoin2',
    address: 'Taj Mahal, Agra, Uttar Pradesh, India',
    image: ['./test/files/resto/resto02.jpeg', 'resto02.jpeg']
  }],
  usertwo: [{
    title: 'The Table',
    description: 'The Table, Mumbai, India',
    address: 'Mumbai, India',
    image: ['./test/files/resto/resto03.jpeg', 'resto03.jpeg']
  },{
    title: 'Thalassa',
    description: 'Thalassa Goa',
    address: 'Goa, India',
    image: ['./test/files/resto/resto04.jpg', 'resto04.jpg']
  },
  {
    title: 'Toast & Tonic',
    description: 'Toast & Tonic, Blr',
    address: 'Bangalore, India',
    image: ['./test/files/resto/resto05.jpeg', 'resto05.jpeg']
  },{
    title: 'SkyBar',
    description: 'SkyBar, Noida',
    address: 'Delhi, India',
    image: ['./test/files/resto/resto06.jpeg', 'resto06.jpeg']
  }]
}

module.exports = {
    usersCred, places
}