/* eslint-disable operator-assignment */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { Incident, Vote } = require('../models');
const ApiError = require('../utils/ApiError');


const createIncident = async (incidentBody) => {
    const incident = await Incident.create(incidentBody);
    return incident;
};

const getIncidents = async () => {
    const incidents = await Incident.find();
    return incidents;
};

const getIncidentById = async (id) => {
    return Incident.findById(id);
};

const updateIncidentById = async (incidentId, incidentBody) => {
    const incident = await getIncidentById(incidentId);
    if (!incident) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Incident not found');
    }
    Object.assign(incident, incidentBody);
    await incident.save();
    return incident;
};

const deleteIncidentById = async (id) => {
    const incident = await getIncidentById(id);
    if (!incident) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Incident not found');
    }
    await incident.remove();
    return incident;
};





module.exports = {
    createIncident,
    getIncidents,
    getIncidentById,
    updateIncidentById,
    deleteIncidentById
}