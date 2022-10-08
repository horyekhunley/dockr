import { Router } from "express";
import {
  create_patient,
  delete_patient,
  get_patient,
  get_patients,
  update_patient,
} from "../controller/patient.controllers";

const patientRoutes = Router();

patientRoutes.route("/").get(get_patients).post(create_patient);

patientRoutes
  .route("/:patientId")
  .get(get_patient)
  .put(update_patient)
  .delete(delete_patient);

export default patientRoutes;