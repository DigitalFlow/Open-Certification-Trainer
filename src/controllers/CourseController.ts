import * as React from "react";
import { StaticRouter } from "react-router-dom";
import { renderToString } from 'react-dom/server'
import { Request, Response, NextFunction } from "express";
import App from "../components/App";
import * as path from "path";
import * as fs from "fs";
import CourseList from "../model/CourseList";
import Certification from "../model/Certification";
import ValidationResult from "../model/ValidationResult";

export let getCourseOverview = (req: Request, res: Response) => {
  let courseDir = path.resolve(__dirname, '..', '..', 'dist', 'courses');

  fs.readdir(courseDir, (err, files) => {
    res.json(new CourseList({courses: files}));
  });
};

export let getCourse = (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'dist', 'courses', req.params.courseName + ".json"));
};

export let postUpload = (req: Request, res: Response) => {
  let data = req.body as Certification;

  fs.writeFile(path.resolve(__dirname, '..', '..', 'dist', 'courses', data.name), JSON.stringify(data), err => {
    if (err){
      console.log(err);
      return res.json(new ValidationResult({success: false, errors: ["Failed to write file"]}));
    }

    return res.json(new ValidationResult({success: true}));
  });
};
