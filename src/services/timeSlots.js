import axios from "axios";

const getBuildingSchedule = (openClassroomSlots) => {
  // openClassroomSlots from portal returns an array of Rooms, each Room has a Schedule
  // which is a list of Weekdays. Each Weekday has a list of times when the room is open

  // we do not care about which room we study in, so let's convert this complicated structure into a list
  // of free time slots and their associated room
  const freeTimes = []

  // iterate over each room
  openClassroomSlots.forEach((room) => {
    // extract room metadata
    const roomNumber = room.roomNumber
    const buildingCode = room.buildingCode

    // iterate over each schedule
    room.Schedule.forEach((schedule) => {
      // extract schedule metadata
      const weekday = schedule.Weekday

      // iterate over each time slot
      schedule.Slots.forEach((slot) => {
        // construct the final object and append it to our list
        freeTimes.push({
          startTime: slot.StartTime,
          endTime: slot.EndTime,
          weekday: weekday,
          roomNumber: roomNumber,
          buildingCode: buildingCode
        })
      })
    })
  })

  return freeTimes
}

export const getFreeTimeSlots = async () => {
  // make an api call to portal
  const res = await axios.get('/api/map/OpenClassrooms')

  // extract building info from response
  const buildings = res.data.data.features

  // each building consists of a list of classrooms
  // portal data is weird, let's convert each portal classroom object
  // to something more reasonable
  const transformedData = buildings.map((portalClassroom) => ({
    coordinates: portalClassroom.geometry.coordinates, // maybe use this for cool geolocation stuff later
    buildingCode: portalClassroom.properties.buildingCode,
    buildingId: portalClassroom.properties.buildingId, // id probably not useful to us but always good to have
    buildingName: portalClassroom.properties.buildingName,

    // portal returns this as a string so we need to convert it to json before extracting 
    // schedule using the getBuildingSchedule function defined above
    openClassroomSlots: getBuildingSchedule(JSON.parse(portalClassroom.properties.openClassroomSlots).data), 
  }))

  return transformedData
}