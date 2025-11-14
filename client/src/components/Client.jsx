import { transcode } from 'buffer'
import {motion} from 'framer-motion'
import { useRef, useState, useEffect } from "react"

const testimonials = [
    {
        id:1,
        name: "Harry william",
        role : "CEO of HARRYIconify",
        image: "https://jsonplaceholder/users/image/1",
        text: "this is the place where i found my imagination getting true",
    },
    {
        id:2,
       name: "Harry william",
        role : "CEO of HARRYIconify",
        image: "https://jsonplaceholder/users/image/1",
        text: "this is the place where i found my imagination getting true",
    },
    {
        id:3,
       name: "Harry william",
        role : "CEO of HARRYIconify",
        image: "https://jsonplaceholder/users/image/1",
        text: "this is the place where i found my imagination getting true",
    },
    {
        id:4,
       name: "Harry william",
        role : "CEO of HARRYIconify",
        image: "https://jsonplaceholder/users/image/1",
        text: "this is the place where i found my imagination getting true",
    },
    {
        id:5,
       name: "Harry william",
        role : "CEO of HARRYIconify",
        image: "https://jsonplaceholder/users/image/1",
        text: "this is the place where i found my imagination getting true",
    },
    {
        id:6,
       name: "Harry william",
        role : "CEO of HARRYIconify",
        image: "https://jsonplaceholder/users/image/1",
        text: "this is the place where i found my imagination getting true",
    }
]



const TestimonialCard = ({testimonials}) => {
  return (
    <motion.div
      className='flex-shrink-0 w-80 bg-white/50 dark:bg-gray-800/30 rounded-xl shadow-lg p-6 mx-4'
      whileHover={{scale:1.05}}
      transition={{type: "spring" , stiffness:300}}
    >
        <div className='flex items-center mb-4'>
            <img
               src={testimonials.image}
               alt={testimonials.name}
               className='w-12 h-12 rounded-full object-cover mr-4'
            />
            <div>
                <h3 className='font-semibold text-gray-800 dark:text-gray-300'>{testimonials.name}</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>{testimonials.role}</p>
            </div>
        </div>
        <p className='italic text-gray-700 dark:text-gray-300'>{testimonials.text}</p>
    </motion.div>
  )
}

const ClientTestimonial = () =>{
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef()

    useEffect(() => {
        const carousel = carouselRef.current;
        if(!carousel) return;

        const scrollWidth = carousel.scrollWidth;
        const clientWidth = carousel.clientWidth;

        const animation ={
            x:[0, -scrollWidth + clientWidth],
            transition :{
                x:{
                    repeat : Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                },
            },
        };
        if(isPaused){
            animation.transition.x = {duration:20};
        }
    }, [isPaused])
    return(
      <div className=' py-16 px-4'>
        <div className="max-w-full mx-auto">
          <h2 className='text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4'>
            What Our Client Say
          </h2>
          <p className='text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto'>
            Don't just take our word for it -hear from some of our amazing clients
          </p>
          <div className='relative overflow-hidden'
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
                ref={carouselRef}
                className=' flex cursor-grab '
                animate ={{
                    x:[0, -carouselRef.current?.scrollWidth + carouselRef.current?.clientWidth],
                }}
                transition={{
                    x: {
                        repeat : Infinity,
                        repeatType: "loop",
                        duration: 20,
                        ease: "linear",
                    }
                }}
                whileTap={{ cursor: "grabbing"}}
            >
                {testimonials.map((testimonial) => (
                    <TestimonialCard key={ `repeate${testimonial.id}`} testimonials={testimonial}/>
                ))}  
            </motion.div>
            
            <div className='absolute left-0 top-0 w-10 h-full bg-gradient-to-r from-blue-50 to-transparent dark:from-gray-800 z-10'/>
            <div className='absolute right-0 top-0 w-10 h-full bg-gradient-to-l from-indigo-100 to-transparent dark:from-gray-800 z-10'/>
          </div>
        </div>
    </div>
    )
}

export default ClientTestimonial