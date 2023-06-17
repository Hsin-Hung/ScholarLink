db.createUser({
  user: "scholarlink",
  pwd: "scholarlink",
  roles: [
    {
      role: "readWrite",
      db: "mydb",
    },
  ],
});

db.options.insertMany([
  {
    values: [
      "Behavioral Sciences",
      "Biomedicine",
      "Business and Management",
      "Chemistry",
      "Climate",
      "Computer Science",
      "Earth Sciences",
      "Economics",
      "Education",
      "Energy",
      "Engineering",
      "Environment",
      "Geography",
      "Psychology",
      "Political Science",
      "History",
      "Law",
      "Life Sciences",
      "Materials Science",
      "Mathematics",
      "Pharmacy",
      "Philosophy",
      "Physics",
      "Public Health",
      "Social Sciences",
      "Statistics",
      "Literature",
    ],
  },
]);
