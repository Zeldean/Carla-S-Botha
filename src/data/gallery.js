export const GalleryItems = [
  {
    slug: "about-me",
    pageType: "detail",
    title: "About Me",
    shape: "portriat",
    image: "/paintings/about-me.png",
    description: "Hello there!\n\nThis is a test paragraph.\n\tThis line starts with a tab.\n\t\tThis line starts with two tabs.\n\nName:\tJohn Doe\nAge:\t25\nCity:\tJohannesburg\n\nItems:\n\t- Apples\n\t- Bananas\n\t- Oranges\n\nEnd of example."
  },
  {
    slug: "art",
    pageType: "gallery",
    title: "Art",
    shape: "portriat",
    image: "/paintings/art.png",
    items: [
      {
        slug: "art-lessons",
        pageType: "detail",
        title: "Art Lessons",
        shape: "portriat",
        image: "/paintings/art/art-lessons.png",
        description: "dasdasdasdasdasd"
      },
      {
        slug: "prints-paintings",
        pageType: "detail",
        title: "Prints & Paintings",
        shape: "landscape",
        image: "/paintings/art/prints-and-paintings.png",
        description: ""
      },
    ]
  },
];
