import { Request, Response } from 'express';
import Project from '../models/projectModel';
import User from '../models/userModel';

export const createProject = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const newProject = await Project.create({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      updates: req.body.updates,
      author: req.body.author,
      createdBy: req.body.createdBy,
      date: req.body.date,
      chat: [],
      tags: req.body.tags.split(' '),
      followers: [],
    });

    const user = await User.findByIdAndUpdate(req.body.createdBy._id, {
      $push: { createdProjects: newProject },
    });

    res.status(201).send({ newProject });
  } catch (error) {
    // console.log(error);
    res.status(400).send({ error, message: 'Could not create project' });
  }
};

export const getProjects = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    // console.log('Hello from getProjects')
    const projects = await Project.find({});
    // console.log('Projects form backend: ', projects)
    res.status(200).send({ projects });
  } catch (error) {
    // console.log(error);
    res.status(400).send({ error, message: 'cannot find projects' });
  }
};

export const getProjectById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const project = await Project.findOne({ _id: req.params.id });
    if (project != null) {
      res.status(200).send(project);
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(400).send({ error, message: 'cannot find project' });
  }
};

export const followProject = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const projectId = req.body.projectId;
    // const user = await User.findOne({ _id: req.body.user._id });
    // user?.following.push(project);
    const user = await User.findByIdAndUpdate(req.body.user._id, {
      $push: { following: projectId },
    });

    // const post = await Post.findOne({ id: project });
    // post.followers.push(user._id);
    // await user.save();

    const post = await Project.findOneAndUpdate(
      { id: projectId },
      {
        $push: { followers: user?._id },
      }
    );

    res.status(200).send({ user });
  } catch (error) {
    // console.log(error);
    res.status(400).send({ error, message: 'cannot follow' });
  }
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const projectId = req.params.id;

    const newUpdate = {
      // id: req.body.id,
      title: req.body.title,
      description: req.body.quillValue,
      date: req.body.date,
      image: req.body.image,
      video: req.body.video,
      chat: [],
    };

    // console.log('💸 💸 ', newUpdate);

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId },
      {
        $push: { updates: newUpdate },
      }
    );

    // const afterUpdate = await Project.findOne({ id: projectId });

    // const project = await Project.findOne(req.params.id, ;
    // project.updates.push(newUpdate);
    // await project.save();

    if (updatedProject != null) {
      res.status(201).send(updatedProject);
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(400).send({ error, message: 'cannot update' });
  }
};

export const followingProjects = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findById(req.params.id);
    const following = user?.following;
    const projects = await Project.find({ _id: { $in: following } });
    res.status(200).send(projects);
  } catch (error) {
    res.status(400).send({ error, message: 'cannot get following' });
  }
};

export const personalProjects = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    // const user = await User.findById(req.params._id);
    // const created = user?.createdProjects;
    // const projects = await Project.find({ _id: { $in: createdProjects } });
    const projects = await Project.find({ createdBy: req.params.id });
    res.status(200).send(projects);
  } catch (error) {
    // console.log(error);
    res.status(400).send({ error, message: 'cannot get your projects' });
  }
};

export const postComment = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    // const project = await Project.findOne(req.body._id);
    const newComment = {
      createdBy: req.body.createdBy,
      comment: req.body.comment,
      date: req.body.date,
    };

    // project.chat.push(newComment);
    // project.save();

    const comment = await Project.findByIdAndUpdate(req.body.projectId, {
      $push: { chat: newComment },
    });

    res.status(201).send({ comment });
  } catch (error) {
    // console.log(error);
    res.status(400).send({ error, message: 'cannot post comment' });
  }
};
