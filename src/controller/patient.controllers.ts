import { Request, Response } from "express";
import { connection } from "../config/mysql.config";
import { Patient } from "../interface/patient";
import { QUERY } from "../query/patient.query";
import { Code } from "../enum/code.enum";
import { HttpResponse } from "../domain/response";
import { Status } from "../enum/status.enum";
import { RowDataPacket } from "mysql2";
import { OkPacket } from "mysql2";
import { ResultSetHeader } from "mysql2";
import { FieldPacket } from "mysql";

type ResultSet = [
  RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader,
  FieldPacket[]
];

export const get_patients = async (
  req: Request,
  res: Response
): Promise<Response<Patient[]>> => {
  console.info(
    ` [${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl
    } Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
  );

  try {
    const pool = await connection();
    const results: ResultSet = await pool.query(QUERY.SELECT_PATIENTS);

    return res
      .status(Code.OK)
      .send(
        new HttpResponse(Code.OK, Status.OK, "Patients retrieved", results[0])
      );
  } catch (error: unknown) {
    console.error(error);
    return res
      .status(Code.INTERNAL_SERVER_ERROR)
      .send(
        new HttpResponse(
          Code.INTERNAL_SERVER_ERROR,
          Status.INTERNAL_SERVER_ERROR,
          "Something went wrong"
        )
      );
  }
};

export const get_patient = async (
  req: Request,
  res: Response
): Promise<Response<Patient>> => {
  console.info(
    ` [${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl
    } Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
  );

  try {
    const pool = await connection();
    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [
      req.params.patientId,
    ]);

    if ((result[0] as Array<ResultSet>).length > 0) {
      return res
        .status(Code.OK)
        .send(
          new HttpResponse(Code.OK, Status.OK, "Patient retrieved", result[0])
        );
    } else {
      return res
        .status(Code.NOT_FOUND)
        .send(
          new HttpResponse(
            Code.NOT_FOUND,
            Status.NOT_FOUND,
            `Patient with id ${req.params.patientId} not found`
          )
        );
    }
  } catch (error: unknown) {
    console.error(error);
    return res
      .status(Code.INTERNAL_SERVER_ERROR)
      .send(
        new HttpResponse(
          Code.INTERNAL_SERVER_ERROR,
          Status.INTERNAL_SERVER_ERROR,
          "Something went wrong"
        )
      );
  }
};

export const create_patient = async (
  req: Request,
  res: Response
): Promise<Response<Patient>> => {
  console.info(
    ` [${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl
    } Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
  );

  let patient: Patient = { ...req.body };
  try {
    const pool = await connection();
    const result: ResultSet = await pool.query(
      QUERY.CREATE_PATIENT,
      Object.values(patient)
    );

    patient = { id: (result[0] as ResultSetHeader).insertId, ...req.body };

    return res
      .status(Code.CREATED)
      .send(
        new HttpResponse(
          Code.CREATED,
          Status.CREATED,
          "Patient created",
          patient
        )
      );
  } catch (error: unknown) {
    console.error(error);
    return res
      .status(Code.INTERNAL_SERVER_ERROR)
      .send(
        new HttpResponse(
          Code.INTERNAL_SERVER_ERROR,
          Status.INTERNAL_SERVER_ERROR,
          "Something went wrong"
        )
      );
  }
};

export const update_patient = async (
  req: Request,
  res: Response
): Promise<Response<Patient>> => {
  console.info(
    ` [${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl
    } Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
  );

  let patient: Patient = { ...req.body };

  try {
    const pool = await connection();
    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [
      req.params.patientId,
    ]);

    if ((result[0] as Array<ResultSet>).length > 0) {
      const result: ResultSet = await pool.query(QUERY.UPDATE_PATIENT, [
        ...Object.values(patient),
        req.params.patientId,
      ]);

      return res
        .status(Code.OK)
        .send(
          new HttpResponse(Code.OK, Status.OK, "Patient updated", {
            ...patient,
            id: req.params.patientId,
          })
        );
    } else {
      return res
        .status(Code.NOT_FOUND)
        .send(
          new HttpResponse(
            Code.NOT_FOUND,
            Status.NOT_FOUND,
            `Patient with id ${req.params.patientId} not found`
          )
        );
    }
  } catch (error: unknown) {
    console.error(error);
    return res
      .status(Code.INTERNAL_SERVER_ERROR)
      .send(
        new HttpResponse(
          Code.INTERNAL_SERVER_ERROR,
          Status.INTERNAL_SERVER_ERROR,
          "Something went wrong"
        )
      );
  }
};

export const delete_patient = async (
  req: Request,
  res: Response
): Promise<Response<Patient>> => {
  console.info(
    ` [${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl
    } Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`
  );

  try {
    const pool = await connection();
    const result: ResultSet = await pool.query(QUERY.SELECT_PATIENT, [
      req.params.patientId,
    ]);

    if ((result[0] as Array<ResultSet>).length > 0) {
      const result: ResultSet = await pool.query(QUERY.DELETE_PATIENT, [
        req.params.patientId,
      ]);

      return res
        .status(Code.OK)
        .send(new HttpResponse(Code.OK, Status.OK, "Patient deleted"));
    } else {
      return res
        .status(Code.NOT_FOUND)
        .send(
          new HttpResponse(
            Code.NOT_FOUND,
            Status.NOT_FOUND,
            `Patient with id ${req.params.patientId} not found`
          )
        );
    }
  } catch (error: unknown) {
    console.error(error);
    return res
      .status(Code.INTERNAL_SERVER_ERROR)
      .send(
        new HttpResponse(
          Code.INTERNAL_SERVER_ERROR,
          Status.INTERNAL_SERVER_ERROR,
          "Something went wrong"
        )
      );
  }
};
