/* eslint-disable no-console */
/* eslint-disable prefer-template */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable import/order */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const messages = require('../config/messages');
// const formidable = require('formidable');
const multer = require('multer');
const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const { incidentService } = require('../services');

// const upload = multer({dest: 'upload/'});

const createIncident = catchAsync(async (req, res) => {
  const incident = await incidentService.createIncident(req.body);
  res.status(httpStatus.CREATED).send(incident);
  res.end();
  // res.status(httpStatus.CREATED).send(messages.success);
});

const getIncidents = catchAsync(async (req, res) => {
  // const filter = pick(req.query, ['title']);
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await incidentService.getIncidents();
  res.send(result);
});

const getIncident = catchAsync(async (req, res) => {
  const incident = await incidentService.getIncidentById(req.params.incidentId);
  if (!incident) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Incident not found');
  }
  res.send(incident);
});

const updateIncident = catchAsync(async (req, res) => {
  const incident = await incidentService.updateIncidentById(req.params.incidentId, req.body);
  res.send(incident);
});

const deleteIncident = catchAsync(async (req, res) => {
  await incidentService.deleteIncidentById(req.params.incidentId);
  res.status(httpStatus.NO_CONTENT).send();
});


module.exports = {
  createIncident,
  getIncidents,
  getIncident,
  updateIncident,
  deleteIncident
};