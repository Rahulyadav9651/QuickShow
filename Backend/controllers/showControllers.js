import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

export const getNowPlayingMovies = async (req, res)=>{

    try{
const {data}= await axios.get('https://api.themoviedb.org/3/movie/now_playing',{
    headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}
})
const movies= data.results;
return res.status(200).json({
    success:true,
    movies:movies
})
        
    }
    catch(error){
        console.log(error);
res.status(401).json(
    {
    success:false,
    message:error.message
})
    }
    
}


//api add new show in db

// export const addShow= async(req, res)=>{

// try{
// const {movieId, showsInput, showPrice}= req.body;

// const movie= await Movie.findById(movieId);
// if(movie){
//    return  res.status(401).json({
//         success:false,
//         message:"Movie is already added"
//     })
// }
// const token = process.env.TMDB_ACCESS_TOKEN;

//     if (!token) {
//       throw new Error("TMDB_ACCESS_TOKEN is missing");
//     }


// if(!movie){
//     const [movieDetailsResponse, movieCreditsResponse]= await Promise.all([
//         axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,{
//             headers:{Authorization:`Berear ${process.env.TMDB_API_KEY}`}
//         }),



//         axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,{headers:{Authorization:`Bearer ${process.env.TMDB_API_KEY}`}})
//     ]);
//     const movieApiData= movieDetailsResponse.data;
//     const movieCreditData= movieCreditsResponse.data;

// const movieDetails={
//     _id:movieId,
//     title:movieApiData.title,
//     overview:movieApiData.overview,
//     poster_path:movieApiData.poster_path,
//     backdrop_path:movieApiData.backdrop_path,
//     genres:movieApiData.genres,
//     casts:movieCreditData.cast,
//     release_date:movieApiData.release_date,
//     original_language:movieApiData.original_language,
//     tagline:movieApiData.tagline || "",
//     vote_average:movieApiData.vote_average,
//     runtime:movieApiData.runtime,
// }
// //add movie in db

// movie= await Movie.create(movieDetails);


// }

// const showsToCreate=[];
// showsInput.forEach(show=>{
//     const showDate= show.date;
//     show.time.forEach((time)=>{
//         const dateTimeString= `${showDate}${time}`;
// showsToCreate.push({
//     movie:movieId,
//     showDateTime: new Date(dateTimeString),
//     showPrice,
//     occupidSeats:{}
// })

//     })
// });

// if(showsToCreate.length>0){
//     await Show.insertMany(showsToCreate);

// }
// return res.status(201).json({
//     success:true,
//     message:"Movie is Added successfully"
// })


    

// }
// catch(error)
// {
// console.log(error);
// res.status(401).json({
//     success:false,
//     message:"Can not add show.Please try again"
// })
// }

// }

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    if (!movieId || !Array.isArray(showsInput) || showsInput.length === 0 || !showPrice) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    let movie = await Movie.findById(movieId);

    // Only fetch from TMDB if we don't have the movie yet
    if (!movie) {
      const headers = { Authorization: `Bearer ${process.env.TMDB_API_KEY}` };

      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, { headers }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, { headers }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditData = movieCreditsResponse.data;

      movie = await Movie.create({
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      });
    }

    const showsToCreate = [];

    for (const show of showsInput) {
      const times = Array.isArray(show.time) ? show.time : [show.time];

      for (const time of times) {
        const showDateTime = new Date(`${show.date}T${time}`);

        if (isNaN(showDateTime.getTime())) {
          return res.status(400).json({
            success: false,
            message: `Invalid date/time: "${show.date}" "${time}"`,
          });
        }

        showsToCreate.push({
          movie: movieId,
          showDateTime,
          showPrice,
          occupiedSeats: {},
        });
      }
    }

    await Show.insertMany(showsToCreate);

    return res.status(201).json({ success: true, message: "Show added successfully" });
  } catch (error) {
    console.error(error.response?.data || error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({ success: false, message: "Movie not found on TMDB" });
    }
    return res.status(500).json({ success: false, message: "Can not add show. Please try again" });
  }
};



// APi to  get All shows from database

export const getShows= async (req, res)=>{

    try{
const shows= await Show.find({showDateTime:{$gte: new Date()}}).populate('movie').sort({showDateTime:1});
//filter unique data
const uniqueShows= new Set(shows.map(show=>show.movie))
return res.status(201).json({
    success:true,
    shows:Array.from(uniqueShows)
})

    }
    catch(error){
console.log(error);
return res.status(401).json({
    success:false,
    message: error.message,
})
    }



}



//APi get a single show from database


export const getShow= async(req,res)=>{

    try{
const {movieId}= req.params;

//get all upcoming movies
const shows= await Show.find({movie:movieId, showDateTime:{$gte: new Date()}})

const movie= await Movie.findById(movieId);
const dateTime= {};
shows.forEach((show)=>{
const date= show.showDateTime.toISOString().split("T")[0];
if(!dateTime[date]){
    dateTime[date]=[]

}
dateTime[date].push({time:show.showDateTime, showId:show._id})
})

return res.status(201).json({
    success:true,
    movie,
    dateTime
})
    }
    catch(error){

        console.log(error);
        return res.status(501).json({
            success:false,
            message:"shwo data is not available"
        })

    }
}