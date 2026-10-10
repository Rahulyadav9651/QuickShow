
import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

const DeteSelect = ({ dateTime, id }) => {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const onBookHandler = () => {
    if (!selected) {
      toast.error('Please select a date')
      return
    }

    navigate(`/movies/${id}/${selected}`)
    window.scrollTo(0, 0)
  }

  return (
    <div id="dateSelect" className="pt-30">
      <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg">

        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" left="0px" />

        <div>
          <p className="text-lg font-semibold">Choose Date</p>

          <div className="flex items-center gap-4 mt-4">

            <ChevronLeftIcon
              width={28}
              className="cursor-pointer"
            />

            <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
              {Object.keys(dateTime).map((date) => {
                const currentDate = new Date(date)

                return (
                  <button
                    key={date}
                    type="button"
                    className={`px-4 py-3 rounded-lg border transition ${
                      selected === date
                        ? 'bg-primary text-white border-primary'
                        : 'border-primary/20 hover:bg-primary hover:text-white'
                    }`}
                    onClick={() => setSelected(date)}
                  >
                    <span className="block text-sm">
                      {currentDate.getDate()}
                    </span>

                    <span className="block text-sm">
                      {currentDate.toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </span>

                    <span className="block text-sm">
                      {currentDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                      })}
                    </span>
                  </button>
                )
              })}
            </span>

            <ChevronRightIcon
              width={28}
              className="cursor-pointer"
            />

          </div>
        </div>

        <button
          onClick={onBookHandler}
          className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer"
        >
          Book Now
        </button>

      </div>
    </div>
  )
}

export default DeteSelect
