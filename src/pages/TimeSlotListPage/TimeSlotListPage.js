import { useState, useEffect } from 'react'

import { getFreeTimeSlots } from '../../services/timeSlots'

export default function ClassroomListPage () {
  const [timeSlots, setTimeSlots] = useState([])

  useEffect(() => {
    const fetchDataFromPortal = async () => {
      const data = await getFreeTimeSlots()
      setTimeSlots(data)
    }

    fetchDataFromPortal()
  }, [])

  console.log(timeSlots)
  
  return (
    <div>
      hello
    </div>
  )
}