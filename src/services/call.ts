import { ICall, ICallDTO } from "../models/call";
import CallModel from "../models/call";
import { Request, Response } from "express";
import { ICreateCallInput } from "../models/call";
import { parseQueryFromURL } from "./parse";
import { getSortMethod } from "./sort";
import { createLocalDate, createLocalTime } from "./time";

export default async function getWithoutGrouping(
  req: Request,
  res: Response
): Promise<ICallDTO[]> {
  const query: any = {};
  const sort: any = {};

  let calls: ICall[] = [];
  let callsAsDTOs: ICallDTO[] = [];

  parseQueryFromURL(req, query);
  getSortMethod(req, sort);

  calls = await CallModel.find(query).sort(sort);

  callsAsDTOs = createDTOs(calls);

  return callsAsDTOs;
}

function createDTOs(calls: ICall[]): ICallDTO[] {
  const dtos: ICallDTO[] = [];
  calls = calls || [];

  calls.forEach((call: ICall) => {
    let dto: ICallDTO = {
      date: createLocalDate(call.datetime),
      time: createLocalTime(call.datetime),
      eventID: call.eventID,
      location: call.location,
      locationCount: calls.filter(
        (obj: ICall) => obj.location === call.location
      ).length,
      type: call.type,
      typeCount: calls.filter((obj: ICall) => obj.type === call.type).length,
    };

    dtos.push(dto);
  });

  return dtos;
}

export async function saveCall({
  datetime,
  eventID,
  location,
  type,
}: ICreateCallInput): Promise<ICall[] | void> {
  CallModel.findOne({ eventID: eventID }).then((res) => {
    if (!res) {
      CallModel.create({
        datetime,
        eventID,
        location,
        type,
      }).catch((error: Error) => {
        throw error;
      });
    }
  });
}