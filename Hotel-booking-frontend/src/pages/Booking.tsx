import { useParams } from "react-router-dom";
import { useSearchContext } from "../context/SearchContext";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useQuery } from "react-query";
import * as apiClient from "../api_client";
import { useAppContext } from "../context/AppContext";
import BookingForm from "../forms/BookingForm/BookingForm";
import BookingDetailsSummary from "../components/BookingDetailsSummary";


const Booking = () => {
const search = useSearchContext();
  const { hotelId } = useParams();
 const {stripePromise} = useAppContext();
  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const {data: hotel}= useQuery("fetchHoelById",()=> apiClient.fetchHotelById(hotelId as string),{
    enabled:!!hotelId,
  })

  const {data: currentUser} = useQuery("fetchCurrentUser",apiClient.fetchCurrentUser);
  console.log(currentUser)

  const {data:paymentIntentData} = useQuery("createPaymentIntent",()=> apiClient.createPaymentIntent(hotelId as string, numberOfNights.toString()),
   {
       enabled:!!hotelId && numberOfNights > 0,
   });

   console.log(paymentIntentData)
  if(!hotel){
    return <></>
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultCount={search.adultCount}
        childCount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {currentUser && paymentIntentData &&(
        <Elements stripe={stripePromise} options={{clientSecret:paymentIntentData.clientSecret}} >
            <BookingForm currentUser={currentUser} paymentIntent = {paymentIntentData} />
        </Elements>
        
      )}
    </div>
  )
}

export default Booking