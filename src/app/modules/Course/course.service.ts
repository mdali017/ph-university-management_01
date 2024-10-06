import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { CourseSearchableFields } from "./course.constant";
import { TCourse, TCourseFaculty } from "./course.interface";
import { CouresModel, CourseFacultyModel } from "./course.model";

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await CouresModel.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    CouresModel.find().populate("preRequisiteCourses.course"),
    query
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  //   const result = await CouresModel.find();
  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await CouresModel.findById(id).populate(
    "preRequisiteCourses.course"
  );
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  // Previous code start here
  // const { preRequisiteCourses, ...courseRemainingData } = payload;
  // // console.log(preRequisiteCourses, "preRequisiteCourses");
  // //   step-1: basic information update
  // const updatedBasicCourseInfo = await CouresModel.findByIdAndUpdate(
  //   id,
  //   courseRemainingData,
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );
  // // check if there is any preRequisiteCourse to update
  // if (preRequisiteCourses && preRequisiteCourses.length > 0) {
  //   // filter out the deleted fields
  //   const deletedPreRequisite = preRequisiteCourses
  //     .filter((el) => el.course && el.isDeleted)
  //     .map((el) => el.course);
  //   // delete the preRequisiteCourse
  //   const deletedPreRequisiteCourses = await CouresModel.findByIdAndUpdate(id, {
  //     $pull: { preRequisiteCourses: { course: { $in: deletedPreRequisite } } },
  //   });
  //   console.log(deletedPreRequisite, "deletedPreReqCourseIds");
  // }
  // return updatedBasicCourseInfo;
  // Previous code end here

  // New code start here
  const { preRequisiteCourses, ...courseRemaingData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // step-1: basic course info update
    const updatedBasicCourseInfo = await CouresModel.findByIdAndUpdate(
      id,
      courseRemaingData,
      {
        new: true,
        runValidators: true,
        session,
      }
    );

    if (!updatedBasicCourseInfo) {
      throw new Error("Course not found");
    }

    // check if there is any preRequisiteCourse to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted fields
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletedPreRequisiteCourses = await CouresModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );

      if (!deletedPreRequisiteCourses) {
        throw new Error("Failed to delete preRequisiteCourse");
      }

      // console.log(preRequisiteCourses, "preRequisiteCourses");
      // console.log(deletedPreRequisites, "deletedPreReqCourseIds");

      // step-2: add new preRequisiteCourse
      const newPrequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted
      );
      // console.log({ newPrequisites });

      const newPreRequisiteCourses = await CouresModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPrequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );
      if (!newPreRequisiteCourses) {
        throw new Error("Failed to add new preRequisiteCourse");
      }
    }

    const result = await CouresModel.findById(id).populate(
      "preRequisiteCourses.course"
    );

    return result;
  } catch (error) {
    throw new Error("Failed to update course");
  }

  // New code end here
};

const deleteCourseFromDB = async (id: string) => {
  const result = await CouresModel.findByIdAndDelete(id, { isDeleted: true });
  return result;
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    { $addToSet: { faculties: { $each: payload } } },
    { upsert: true, new: true, runValidators: true }
  );

  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDB,
};
