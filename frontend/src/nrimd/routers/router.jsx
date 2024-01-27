

import App from '../../App.jsx'
import NrimdIntro from '../Intro.jsx'
import NrimdSubmit from '../Submit.jsx'
import NrimdResult from '../Result.jsx'
import NrimdExample from '../Example.jsx'
import NrimdGuide from '../Guide.jsx'
import NrimdCheck from '../Check.jsx'
import NrimdContact from '../Contact.jsx'
import NrimdCookies from '../Cookies.jsx'
import NotFound from '../NotFound.jsx'
import Error from '../Error.jsx'

import {BrowserRouter as Router,Route,Routes} from 'react-router-dom'


const BaseRouter=()=>(
    <Router>
        <Routes>
            <Route element={<App/>}>
                <Route path='/' element={<NrimdIntro/>}></Route>
                <Route path='/introduction' element={<NrimdIntro/>}></Route>
                <Route path='/submit' element={<NrimdSubmit/>}></Route>
                <Route path='/result' element={<NrimdCheck/>}></Route>
                <Route path='/example' element={<NrimdExample/>}></Route>
                <Route path='/guide' element={<NrimdGuide/>}></Route>
                <Route path='/result/:id' element={<NrimdResult/>}></Route>
                <Route path='/contact' element={<NrimdContact/>}></Route>
                <Route path='/cookies' element={<NrimdCookies/>}></Route> 
                <Route path='/error' element={<Error/>}></Route> 
		<Route path='*' element={<NotFound />}></Route> 
            </Route>
        </Routes>
    </Router>
)
export default BaseRouter
