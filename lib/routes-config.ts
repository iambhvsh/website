// for page navigation & to sort on leftbar
export const ROUTES = [
  {
    title: "Projects",
    href: "projects",
    items: [
      { title: "thepixelstore", href: "/thepixelstore" }
    ],
  },
];

export const page_routes = ROUTES.map(({ href, items }) => {
  return items.map((link) => {
    return {
      title: link.title,
      href: href + link.href,
    };
  });
}).flat();
