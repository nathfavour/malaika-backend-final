import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import Contribution, { IContribution } from "../../models/Contributions";
import Project from "../../models/Projects";
import Request from "../../types/Request";

const router: Router = Router();

// @route   POST api/contributions
// @desc    Create a new contribution and update project information
// @access  Public

router.post("/", [
  check("contributorAddress", "Contributor address is required").not().isEmpty(),
  check("projectTitle", "Project Title is required").not().isEmpty(),
  check("contributionAmount", "Contribution Amount is required").not().isEmpty(),
  check("user", "User is required").not().isEmpty(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }

  try {
    const { contributorAddress, projectTitle, contributionAmount, user } = req.body;

    // Create a new contribution using the Contribution model
    const contribution: IContribution = new Contribution({
      projectTitle,
      contributionAmount,
      user,
      contributorsAddress: "", // You can set this property as needed
    });

    await contribution.save();

    // Update project information in the Projects table
    const project = await Project.findOneAndUpdate(
      { user, projectTitle },
      {
        $inc: {
          totalContributors: 1,
          totalContribution: contributionAmount,
        },
      },
      { new: true }
    );

    if (!project) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ msg: "Project not found" });
    }

    // Update contributors' table by adding a new row
const newContributor = await Contribution.create({
  contributorAddress,
  projectTitle,
  contributionAmount,
  user,
});

if (!newContributor) {
  // Handle error if the new contributor wasn't created
  return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Failed to create new contributor" });
}




    res.json({ contribution, project });
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
});

export default router;
