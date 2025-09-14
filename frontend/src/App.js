import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Cancellation from "./pages/Cancellation";
import Itineraries from "./pages/Itineraries";
import TrackBus from "./pages/TrackBus";
import RefundStatus from "./pages/RefundStatus";
import TrackTicket from "./pages/TrackTicket";
import RescheduleTicket from "./pages/RescheduleTicket";
import NearbyLocation from "./pages/NearbyLocation";
import CurrentStatus from "./pages/CurrentStatus";
import BusPass from "./pages/BusPass";
import ViewTicket from "./pages/ViewTicket";
import BookSeat from "./pages/BookSeat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/cancellation" element={<Cancellation />} />
        <Route path="/itineraries" element={<Itineraries />} />
        <Route path="/trackbus" element={<TrackBus />} />
        <Route path="/refundstatus" element={<RefundStatus />} />
        <Route path="/trackticket" element={<TrackTicket />} />
        <Route path="/rescheduleticket" element={<RescheduleTicket />} />
        <Route path="/nearbylocation" element={<NearbyLocation />} />
        <Route path="/currentstatus" element={<CurrentStatus />} />
        <Route path="/buspass" element={<BusPass />} />
        <Route path="/viewticket" element={<ViewTicket />} />
        <Route path="/bookseat" element={<BookSeat/>}/>
      </Routes>
    </Router>
  );
}

export default App;
