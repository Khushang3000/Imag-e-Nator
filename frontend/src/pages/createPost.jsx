import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import {preview} from "../assets";
import {getRandomPrompt} from "../utils";
import { FormField, Loader } from '../components';
const createPost = () => {
  const navigate = useNavigate(); //this will help us to take use back to the home page once the post is created.
  const [form, setForm] = useState({//initially it will be an object which will have these things.
    name: '',
    prompt: '',
    photo: '',
  })

  const [generatingImg, setgeneratingImg] = useState(false);//this is used when we are making contact with the api and waiting for our image.

  const [Loading, setLoading]= useState(false);//just normal loading state.

  const handleSubmit = async (e)=>{
    e.preventDefault();//keeps browser from it's default behavior, for ex: browser reloads the whole page when we submit a form, but if we wanted that, then what would be the point of making SPAs and using v-dom with react? 
    
    if(form.prompt && form.photo){
      setLoading(true);
      try {
        const response = await fetch('https://imag-e-nator.onrender.com',{
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify(form)//we changed data in the form  name and prompt from handleChange,surprise prompt from handleSurpriseMe, and photo in generateImg
        })

          //         📦 The Response object contains:
          // 1.Headers

          // 2.Status code (e.g., 200, 404)

          // 3.Methods to extract the actual body content:
          // .json() → if the response is JSON ✅
          // .text() → if the response is plain text
          // .blob() → for binary files (images, etc.)
          // .formData() → for form responses
        await response.json();//just means that we got it successfuly
        navigate('/');
      } catch (error) {
        alert(error)
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please Enter a Prompt to Generate The Image')
    }
  
  }

  const generateImg = async ()=>{

    if(form.prompt){
      try{
        setgeneratingImg(true);
        const response = await fetch("https://imag-e-nator.onrender.com/api/v1/dalle",{
          method: "POST",
          headers: {
            "Content-Type":"application/json",
          },
          body:JSON.stringify({prompt: form.prompt})//server expects bodies to be a binary or string. and then server will parse using JSON.parse()
          // You're telling the server: "Hey, I'm sending JSON", so the body must be a stringified JSON (not a JavaScript object).
        })
        
        const data = await response.json(); //cuz we stringified it above.

        setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`});//🔸 Because of how images are rendered in the browser.
        // If you're trying to display the image in an <img> tag, the browser expects a complete URL or a data URI.
        // and all the extra fluff that we did was that datauri scheme.
      }catch(err){
        alert(err)
      }finally{
        setgeneratingImg(false);
      }
    }else{
      alert('Please Enter a Prompt');
    }

    
  }


  const handleChange = (e)=>{//event is it's first and only parameter. and this event specifically is key-press event.
    setForm({...form, [e.target.name] : e.target.value }) //e.target will be the element you will be focusing on(YOUR_NAME BOX OR PROMPT BOX), in our case input boxes, also we are prop drilling(not really as there's just one layer here, but if there were more than one than it would be a mess that's why we have contexts.) our functions like handleChange into Formfields
    //so it's like input.name : input.value 
    //surpriseMe button doesn't come under this as it's not happening due to an event like keydown!!!
  }

  const handleSurpriseMe = ()=>{
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({...form, prompt:randomPrompt})

  }

  

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
          <p className = "mt-2 text-[#666e75] text-[16px] max-w-[500px]">
           Create imaginative and visually stunning images through IMAGINATOR!!! <span className='font-extralight text-[#222328] text-[10px]'>you can share them too!</span>
          </p>
      </div>
      <form className='mt-16' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField 
            LabelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex: John Doe"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField 
            LabelName="Prompt"
            type="text"
            name="prompt"
            placeholder="Ex: 'The long-lost Star Wars 1990 Japanese Anime'"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe = {true}
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo? (<img src={form.photo} alt={form.prompt} className='w-full h-full object-contain' />):(<img src={preview} alt="preview" className='w-9/12 h-9/12 object-contain opacity-40'/>)}
            {/* w-9/12 means 9/12th the width of the parent */}
            {generatingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className='mt-5 flex gap-5'>
          <button type="button" onClick={generateImg} className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-2 py-2.5 text-center'>
            {generatingImg?"Generating...":"Generate"}
          </button>
        </div>
        <div className='mt-2 text-[#666e75] text-[14px]'>
          <p>Once you have created the image you want, you can share it with others in the community</p>
          <button type='submit' className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
            {Loading?"Sharing...":"Share with the Community"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default createPost;