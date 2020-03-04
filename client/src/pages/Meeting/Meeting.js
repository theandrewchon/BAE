
import React, { useState, useEffect } from "react";
import "./style.css";
import API from "../../utils/API";
// import MeetingNotes from "../../components/MeetingNotes";
import AttendeeCard from "../../components/attendeeCard";
import Agenda from "../../components/agenda";
// import { PromiseProvider } from "mongoose";
import { Editor } from "@tinymce/tinymce-react";

function Meeting() {
  const [meeting, setMeeting] = useState([]);
  const [attendees, setAttendees] = useState([]);

  var url = "http://localhost:3000/meeting/5e5f0dfad0fc5239c4c86bab";
  var id = url.substring(url.lastIndexOf("/") + 1);






  const [content, setContent] = useState("");




  var full_url = document.URL; // Get current url
  var url_array = full_url.split('/') // Split the string into an array with / as separator
  var id = url_array[url_array.length - 1];  // Get the last part of the array (-1)


  // console.log(id);

  useEffect(() => {
    // loadMeeting();
  }, []);

  console.log(attendees);

  function loadMeeting() {
    // console.log(id);
    API.getMeeting(id)
      .then(res => {
        // console.log(res.data);
        setAllUsers(res.data.users);
        setMeeting(res.data);
      })
      .catch(err => console.log(err));
  }
  let allMeetingUsers = [];
  function setAllUsers(users) {
    console.log("thisisallusers", users);
    users.forEach(user => {
      API.getUser(user).then(res => {
        let newUser = res.data;
        allMeetingUsers.push(newUser);
        setAttendees(allMeetingUsers);
      });
    });
  }
  console.log("userarra----------y", attendees);
  // function loadAttendees() {
  //   res => {
  //     setAttendees(meeting.users);
  //   };
  // }

  function hideVotes() {
    var x = document.getElementById('js-votes');
    if (x.style.display === 'none') {
      x.style.display = 'block';
    } else {
      x.style.display = 'none';
    }
  }

  function handleUpVote(id) {
    meeting.agenda.forEach(singleAgenda => {
      if (id === singleAgenda._id) {
        singleAgenda.vote += 1;
      }
      loadMeeting();
      // console.log(meeting._id);
      API.updateMeeting(meeting._id, meeting);
    });
  }

  function handleDownVote(id) {
    meeting.agenda.forEach(singleAgenda => {
      if (id === singleAgenda._id) {
        singleAgenda.vote -= 1;
      }
      loadMeeting();
      // console.log(meeting);
      API.updateMeeting(meeting._id, meeting);
    });
  }

  function handleTask(id) {
    meeting.agenda.forEach(singleAgenda => {
      if (id === singleAgenda._id) {
        var inputVal = document.getElementById('task').value;
        // console.log(inputVal)

        singleAgenda.tasks.push({
          "completed": false,
          "userId": "333",
          "meetingId": meeting._id,
          "agendaId": id,
          "task": inputVal
        });


        singleAgenda.tasks.task = inputVal;
        API.updateMeeting(meeting._id, meeting);
        // API.updateMeeting(meeting._id, {'$set': {
        //   'singleAgenda.tasks.task': {inputVal}}});

      }
      API.updateMeeting(meeting._id, meeting)
      // console.log(meeting);
      // console.log(singleAgenda.tasks.task);
      // console.log(meeting._id);
      // console.log(meeting);
    });
  }

  function handleNotes(id) {

    console.log(id);
    var inputNote = content;
    console.log(inputNote)
    meeting.meetingNote.push({
      "userName": "katieb",
      "note": inputNote
    });
    // console.log(inputVal)
    API.updateMeeting(meeting._id, meeting)

    // console.log(meeting);
    console.log(inputNote);
    console.log(meeting._id);
    console.log(meeting);
    // console.log(content);

    var inputNote = document.getElementById('notes').value;
    // console.log(inputVal)
    API.updateMeeting(meeting._id, {
      $set: {
        'meeting.note': { inputNote }
      }
    });
    // console.log(meeting);
    console.log(inputNote);
    console.log(meeting._id);
    console.log(meeting);

  }

  function handleEditorChange(content, editor) {
    console.log("Content was updated:", content);
    setContent(content);
  };

  return (
    <>
      <div class="grid grid-rows-7 grid-flow-col gap-1">
        <div class="row-start-1"></div>
        <div class="row-start-2 col-start-2 col-span-4 text-2xl">
          Meeting Title:
          {meeting.name}
        </div>
        <div className="row-start-2 col-start-8 col-span-2 text-2xl underline text-center">
          Attendees
        </div>
        <div className="row-start-3 col-start-2 col-span-4 text-lg">
          Outcome:{meeting.outcome}
        </div>

        <div className="row-start-4 col-start-2 col-span-4 text-lg">
          Pre-Mtg Info / BAE items:{meeting.backgroundForMeeting}
        </div>


        <div className="row-start-5 col-start-2 col-span-2 text-lg">
          {" "}

          Agenda:
          {meeting.agenda ? (
            <div>
              {meeting.agenda.map(agenda => {
                console.log(agenda);
                return (
                  <Agenda
                    agenda={agenda}
                    key={agenda._id}
                    handleDownVote={handleDownVote}
                    handleUpVote={handleUpVote}
                    handleTask={handleTask}
                    tasks={agenda.tasks}
                  ></Agenda>
                );
              })}
            </div>
          ) : (
              <></>
            )}
        </div>

        <div className="row-start-6 row-end-6 col-start-2 col-span-4 text-lg">
          Notes:
          <Editor
            apiKey="avgvd7u4i68a9mq24lbgo9zusv5tq1vyu4pw9xrjkt9depds"
            initialValue="<p>This is the initial content of the editor</p>"
            id="notes"

            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount"
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help"
            }}
            onEditorChange={handleEditorChange}

          />
        </div>

        <div className="row-start-3 row-span-4 col-start-8 col-span-2 flex justify-center ">
          {meeting.users ? (
            <>
              {attendees.map(attendee => {
                console.log(attendee);
                return <AttendeeCard attendee={attendee}></AttendeeCard>;
              })}
            </>
          ) : (
              <></>
            )}
        </div>
        <div className="row-start-7 col-start-4">

          <input
            type="submit"
            value="Start Meeting"
            className="mx-auto bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={() => hideVotes()}
          ></input>
        </div>
        <div class="row-start-7 col-start-4">
          <input
            type="submit"
            value="End Meeting"
            className="mx-auto bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={() => handleNotes()}
          ></input>
        </div>
      </div>
    </>
  );
}

export default Meeting;

/*

  EXAMPLE API CALL AND DATA; NOT ACTUAL CODE

  */

//  const [meeting, setMeeting] = useState({});
//  useEffect(() => {
//    loadAllMeetings();
//  }, []);

//API call to get meeting and add to state
//  const loadAllMeetings = () => {
//    API.getAllMeetings().then(res => {
//      setMeeting(res.data);
//      console.log(res.data);
//    });
//  };

/* END OF EXAMPLE */
