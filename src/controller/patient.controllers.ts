import {Request, Response} from "express";
import {connection} from "../config/mysql.config";
import {Patient} from "../interface/patient";
import {QUERY} from "../query/patient.query";
import {Code} from "../enum/code.enum";
import {HttpResponse} from "../domain/response";
import {Status} from "../enum/status.enum";


export const get_patients = async(req: Request, res: Response): Promise<Response<Patient[]>> => {
    console.info(` [${new Date().toLocaleString()}] Incoming ${req.method} ${req.originalUrl} Request from ${req.rawHeaders[0]} ${req.rawHeaders[1]}`)

    try {
        const pool = await connection()
        const results: any = await pool.query(QUERY.SELECT_PATIENTS)

        return res.status(Code.OK).send(new HttpResponse(Code.OK, Status.OK, 'Patients retrieved', results[0]))
    } catch (error: unknown) {
        console.error(error)
        return res.status(Code.INTERNAL_SERVER_ERROR).send(new HttpResponse(Code.INTERNAL_SERVER_ERROR,
            Status.INTERNAL_SERVER_ERROR,
            'Something went wrong'))
        
    }
}