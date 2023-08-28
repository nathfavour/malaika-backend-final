import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import Project, { IProject, TProject } from "../../models/Projects";
import Request from "../../types/Request";
import Contribution from "../../models/Contributions";

const router: Router = Router();

// @route   POST api/projects
// @desc    Create a new project
// @access  Public

router.post("/", [
  check("nickname", "nickname is required").not().isEmpty(),
  check("projectTitle", "Project Title is required").not().isEmpty(),
  check("projectDescription", "Project Description is required").not().isEmpty(),
  check("projectCategory", "Project Category is required").not().isEmpty(),
  check("amountToRaise", "Amount to Raise is required").not().isEmpty(),
  check("minimumBuyIn", "Minimum Buy In is required").not().isEmpty(),
  check("roi", "Rate of Interest is required").not().isEmpty(),
  check("stakeAmount", "Stake Amount is required").not().isEmpty(),
  check("photo", "Photo or Video is required").not().isEmpty(),

], async (req: Request, res: Response) => {
  // ... (existing code)

  try {
    const projectFields: TProject = {
      user: undefined,
      nickname: req.body.nickname,
      projectTitle: req.body.projectTitle,
      projectDescription: req.body.projectDescription,
      projectCategory: req.body.projectCategory,
      amountToRaise: req.body.amountToRaise,
      minimumBuyIn: req.body.minimumBuyIn,
      roi: req.body.roi,
      photo: req.body.photo,
      stakeAmount: req.body.stakeAmount,
      totalContributors: 0,
      totalContribution: 0
    };

    // Create a new project using the Project model
    const project: IProject = new Project(projectFields);

    await project.save();

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});


// @route   GET api/projects
// @desc    Get all projects
// @access  Public

router.get("/", async (_req: Request, res: Response) => {
  try {
    // Find all projects
    const projects: IProject[] = await Project.find();

    // Sort projects alphabetically based on projectTitle
    projects.sort((a, b) => a.projectTitle.localeCompare(b.projectTitle));

    res.json(projects);
  } catch (err) {
    console.error("Error in fetching projects:", err);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server Error" });
  }
});


// @route   PUT api/projects/:projectId
// @desc    Update project details
// @access  Public
// Possible to use RETURN-MECHANISM



router.put(
  "/:user",
  [
    check("user", "User address is required").not().isEmpty(),
    // ... (other validations)
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    try {
      const userAddress = req.params.user;

      // Find the project to update based on the user address
      let project: IProject | null = await Project.findOne({
        user: userAddress,
      });

      if (!project) {
        return res
          .status(HttpStatusCodes.NOT_FOUND)
          .json({ msg: "Project not found" });
      }

      // Exclude fields that should not be updated directly
      const { user, totalContributors, totalContribution, ...updateFields } = req.body;

      // Identify immutable fields provided in the request
      const immutableFields = [];
      if (user) immutableFields.push("user");
      if (totalContributors) immutableFields.push("totalContributors");
      if (totalContribution) immutableFields.push("totalContribution");

      if (immutableFields.length > 0) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          msg: "Some fields are immutable and cannot be updated directly in this manner.",
          immutableFields,
        });
      }

      // Update project details
      project = await Project.findOneAndUpdate(
        { user: userAddress },
        { $set: updateFields }, // Using the extracted updateFields
        { new: true }
      );

      res.json({
        msg: "Mutable fields have been updated successfully.",
        project,
      });
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);


// Update Project's address field, and transfer ownership.

router.put(
  "/update-user/:address/:projectTitle",
  async (req: Request, res: Response) => {
    try {
      const { address, projectTitle } = req.params;

      // Find the project to update based on the address and projectTitle
      const projectToUpdate = await Project.findOne({
        user: address,
        projectTitle: projectTitle,
      });

      if (!projectToUpdate) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          msg: "Project not found",
        });
      }

      // Update the "user" field of the project
      projectToUpdate.user = address;
      await projectToUpdate.save();

      res.json(projectToUpdate);
    } catch (err) {
      console.error(err.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
  }
);


// Get projects without user address, and select one to add an address to, identified based on user input.

router.get("/projects-without-user", async (_req: Request, res: Response) => {
  try {
    // Find projects without defined "user" addresses
    const projectsWithoutAddress = await Project.find({
      user: { $exists: false },
    });

    // Assign unique IDs to projects without addresses
    const projectsWithIDs = projectsWithoutAddress.map((project: { toObject: () => any; }, index: number) => ({
      projectID: `Project-${index + 1}`,
      ...project.toObject(),
    }));

    res.json(projectsWithIDs);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});


// @route   DELETE api/projects/:projectId
// @desc    Delete a project
// @access  Public

router.delete("/:address/:projectTitle", async (req: Request, res: Response) => {
  try {
    const { address, projectTitle } = req.params;

    // Find the project to delete based on address and projectTitle
    let project: IProject | null = await Project.findOne({
      user: address,
      projectTitle: projectTitle,
    });

    if (!project) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ msg: "Project not found" });
    }

    // Check projectContribution and projectContributors
    const totalContribution = project.totalContribution || 0;
    const totalContributors = project.totalContributors || 0;

    if (totalContribution > 0 || totalContributors > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        msg:
          `This project cannot be deleted because it has non-zero contributions or contributors.` +
          ` Total contribution: ${totalContribution}, Total contributors: ${totalContributors}`,
      });
    }

    // Delete the project
    await project.remove();

    res.json({ msg: "Project deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});



//Optional routes for return of contributions after delete of project
router.get("/fetch-contributors/:address/:projectTitle", async (req: Request, res: Response) => {
  try {
    const { address, projectTitle } = req.params;

    // Find the deleted project's details based on address and projectTitle
    const deletedProject: IProject | null = await Project.findOne({
      user: address,
      projectTitle: projectTitle,
    });

    if (!deletedProject) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ msg: "Deleted project not found" });
    }

    // Check if total contributions or contributors were non-zero
    const totalContribution = deletedProject.totalContribution || 0;
    const totalContributors = deletedProject.totalContributors || 0;

    if (totalContribution === 0 && totalContributors === 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        msg: "No non-zero contributions or contributors for this project",
      });
    }

    // Fetch contributors' information for the deleted project
    const contributors = await Contribution.find({
      user: address,
      projectTitle: projectTitle,
    });

    if (!contributors) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ msg: "Contributors not found for the deleted project" });
    }

    res.json({ deletedProject, contributors });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// Remove contributor's information from database

router.post("/return-contributions", async (req: Request, res: Response) => {
  try {
    const contributions: {
      contributorsAddress: string;
      projectTitle: string;
      contributionAmount: number;
      user: string;
    }[] = req.body;

    for (const contribution of contributions) {
      const { contributorsAddress, projectTitle, contributionAmount, user } = contribution;

      // Find the project to update based on user and projectTitle
      let project: IProject | null = await Project.findOne({
        user: user,
        projectTitle: projectTitle,
      });

      if (!project) {
        return res
          .status(HttpStatusCodes.NOT_FOUND)
          .json({ msg: "Project not found" });
      }

      // Decrement totalContributors by 1
      project.totalContributors -= 1;

      // Decrement totalContribution by contributionAmount
      project.totalContribution -= contributionAmount;

      // Save the updated project
      await project.save();

      // Delete matching contribution records from contributors table
      await Contribution.deleteMany({
        contributorsAddress: contributorsAddress,
        user: user,
        projectTitle: projectTitle,
      });
    }

    res.json({ msg: "Contributions returned successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

// List of projects created by a user:
// @route   GET api/projects/user/:address
// @desc    Get all projects associated with a specific user address
// @access  Public

router.get("/user/:address", async (req: Request, res: Response) => {
  try {
    const userAddress = req.params.address;

    // Find all projects associated with the provided user address
    const projects: IProject[] = await Project.find({ user: userAddress });

    // Organize the project data in a structured JSON format
    const organizedProjects = projects.map((project) => ({
      nickname: project.nickname,
      projectTitle: project.projectTitle,
      projectDescription: project.projectDescription,
      projectCategory: project.projectCategory,
      amountToRaise: project.amountToRaise,
      minimumBuyIn: project.minimumBuyIn,
      roi: project.roi,
      stakeAmount: project.stakeAmount,
      photo: project.photo,
      totalContributors: project.totalContributors,
      totalContribution: project.totalContribution,
    }));

    res.json(organizedProjects);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;