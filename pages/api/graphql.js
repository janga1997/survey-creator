import express from "express";
import jsonGraphqlExpress from "json-graphql-server";

const app = express();
const data = {
  surveys: [
    {
      id: 1,
      title: "Coffee Farm Survey",
      order: ["question:db1e5566", "folder:951cddd6"],
    },
    { id: 2, title: "Cocoa Farm Survey" },
  ],
  questions: [
    {
      id: "question:db1e5566",
      text: "What's your name?",
      survey_id: 1,
      required: true,
      answerType: "TEXT",
      folder_id: null,
      options: [],
    },
    {
      id: "question:29c49956",
      text: "What's your college?",
      survey_id: 1,
      required: true,
      answerType: "SELECT",
      folder_id: "folder:951cddd6",
      options: ["MIT", "Harvard"],
    },
  ],
  folders: [
    {
      id: "folder:951cddd6",
      name: "KYC Info",
      survey_id: 1,
      folder_id: null,
      order: ["question:29c49956"],
    },
  ],
};

app.use("/api/graphql", jsonGraphqlExpress(data));

export default app;
