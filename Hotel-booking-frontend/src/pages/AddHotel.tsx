
import { useAppContext } from '../context/AppContext'
import { useMutation } from 'react-query';
import * as apiClient from "../api_client";
import ManageHotelForm from '../forms/ManageHotelForm/ManageHotelForm'
const AddHotel = () => {
    const { showToast } = useAppContext();
    const {mutate,isLoading} = useMutation(apiClient.addMyhotel,{
        onSuccess:()=>{
            showToast({message:"Hotel Saved",type:"SUCCESS"})
        },
        onError:()=>{
            showToast({message:"Error Saving Hotel",type:"ERROR"})
        },
    });

    const handleSave =(hotelFormData: FormData)=>{
        mutate(hotelFormData)
    }
  return (
    <div>
      return <ManageHotelForm onSave={handleSave} isLoading={isLoading}/>;
    </div>
  )
}

export default AddHotel
