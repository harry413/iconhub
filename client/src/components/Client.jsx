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
    name: "John Doe",
    role: "CTO of Iconify",
    image: "https://jsonplaceholder/users/image/2",
    text: "Iconify has transformed the way we approach design. The quality and variety of icons available have made our projects more visually appealing and user-friendly.",
  },
  {
    id:3,
    name: "Jane Smith",
    role: "Product Manager at Iconify",
    image: "https://jsonplaceholder/users/image/3",
    text: "I can't imagine working on a project without Iconify. The icons are not only beautiful but also highly customizable, allowing us to maintain a consistent brand identity across all our products.",
  },
  {
    id:4,
    name: "Michael Johnson",
    role: "UX Designer at Iconify",
    image: "https://jsonplaceholder/users/image/4",
    text: "Iconify has been a game-changer for our design team. The extensive library of icons has saved us countless hours of work, and the ease of integration into our design tools has made our workflow much more efficient.",
  },
    {
    id:5,
    name: "Emily Davis",
    role: "Marketing Specialist at Iconify",
    image: "https://jsonplaceholder/users/image/5",
    text: "As a marketer, I rely on Iconify to create visually appealing campaigns. The icons are not only eye-catching but also convey our message effectively, helping us engage with our audience and drive conversions.",
  },
   {
    id:6,
    name: "David Wilson",
    role: "Front-end Developer at Iconify",
    image: "https://jsonplaceholder/users/image/6",
    text: "Iconify has made my job as a front-end developer much easier. The icons are lightweight and optimized for performance, ensuring that our websites load quickly without compromising on visual quality.",
   },
   {
    id:7,
    name: "Sarah Thompson",
    role: "Graphic Designer at Iconify",
    image: "https://jsonplaceholder/users/image/7",
    text: "Iconify has elevated our design projects to a whole new level. The icons are not only visually stunning but also versatile, allowing us to create unique and memorable designs that resonate with our audience.",
   },
   {
    id:8,
    name: "Robert Martinez",
    role: "UI/UX Designer at Iconify",
    image: "https://jsonplaceholder/users/image/8",
    text: "Iconify has become an indispensable tool in my design toolkit. The icons are not only aesthetically pleasing but also highly functional, enabling me to create intuitive and user-friendly interfaces that enhance the overall user experience.",
   }
]



const TestimonialCard = ({testimonials}) => {
  return (
    <motion.div
      className='flex-shrink-0 w-140 bg-white/50 dark:bg-gray-800/30 rounded-xl shadow-lg p-6 mx-4'
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
      <div className='py-16 px-4'>
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