import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import '../../styles/gradientColors.css';
import API from '../../utils/API';
import AttendeeCard from '../../components/attendeeCard';
import Agenda from '../../components/agenda';
import BAE from '../../components/BAE';
import Navbar from '../../components/Navbar';
import { Editor } from '@tinymce/tinymce-react';
import Speech from '../../components/speech';

function Meeting() {
  const [meeting, setMeeting] = useState([]);
  const [attendees, setAttendees] = useState([]);
  let userInputRef = useRef();
  const [meetingStatus, setMeetingStatus] = useState([]);

  const [content, setContent] = useState('');
  const [userTaskName, setuserTaskName] = useState([]);
  const [agendaFiltered, setagendaFiltered] = useState([]);
  const inputRef = useRef();

  var full_url = document.URL; // Get current url
  var url_array = full_url.split('/'); // Split the string into an array with / as separator
  var id = url_array[url_array.length - 1]; // Get the last part of the array (-1)

  useEffect(() => {
    loadMeeting();
  }, []);

  function loadMeeting() {
    API.getMeeting(id)
      .then(res => {
        setMeeting(res.data);
        setMeetingStatus(res.data.meetingStarted);
        setagendaFiltered(res.data.agenda.sort(sortAgenda));
        let users = res.data.users;
        return Promise.all(
          users.map(user => {
            return API.getUser(user).then(res => {
              return res.data;
            });
          })
        );
      })
      .then(result => {
        setAttendees(result);
      })
      .catch(err => console.log(err));
  }

  let sortAgenda = (a, b) => {
    let voteA = a.vote;
    let voteB = b.vote;
    return voteB - voteA;
  };

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
      API.updateMeeting(meeting._id, meeting);
      loadMeeting();
    });
  }

  function handleDownVote(id) {
    meeting.agenda.forEach(singleAgenda => {
      if (id === singleAgenda._id) {
        singleAgenda.vote -= 1;
      }
      API.updateMeeting(meeting._id, meeting);
      loadMeeting();
    });
  }

  let userInput = '';

  const agendaInputValue = event => {
    userInput = event.target.value;
  };

  function handleTask(id) {
    console.log('333333', userInput);
    meeting.agenda.forEach(singleAgenda => {
      if (id === singleAgenda._id) {
        var inputVal = userInput;
        // console.log("handle task", inputVal);

        singleAgenda.tasks.push({
          completed: false,
          meetingId: meeting._id,
          agendaId: id,
          task: inputVal
        });
        singleAgenda.tasks.task = inputVal;
      }
      API.updateMeeting(meeting._id, meeting);
      loadMeeting();
    });
  }

  function handleNotes(id) {
    var inputNote = content;
    meeting.meetingNote.push({
      userName: 'katieb',
      note: inputNote
    });
    console.log(meeting);
    API.updateMeeting(meeting._id, meeting);
    var inputNote = document.getElementById('notes').value;
    API.updateMeeting(meeting._id, {
      $set: {
        'meeting.note': { inputNote }
      }
    });
  }

  let userTaskArray = [];

  const addUserTask = action => {
    meeting.agenda.forEach(singleAgenda => {
      if (singleAgenda._id === action.target.getAttribute('agendaidforuser')) {
        singleAgenda.tasks.map(task => {
          if (task._id === action.target.getAttribute('taskidforuser')) {
            let userAssignedToTask = {
              name: `${action.target.getAttribute(
                'attendeefirstname'
              )} ${action.target.getAttribute('attendeelastname')}`,
              taskid: action.target.getAttribute('taskidforuser')
            };

            //redherring state, works because it resets the state in agenda however this state is not being used, will be deleted once I fix errors
            setuserTaskName(userAssignedToTask);

            task['user'] = action.target.getAttribute('useridvalue');
          }
          API.updateMeeting(meeting._id, meeting);
        });
      }
    });
  };

  function sendMail() {
    var link =
      'mailto: mcbride.katieb@gmail.com; taylor.m.mcbride@gmail.com' +
      '?cc=buhler.katie@gmail.com' +
      '&subject=' +
      escape('Post Meeting Survey') +
      '&body=' +
      escape(document.getElementById('myText').value);

    window.location.href = link;
  }

  function returnBack() {
    window.history.back();
  }

  function handleEditorChange(content, editor) {
    setContent(content);
  }

  return (
    <>
      <Navbar />
      <div className="grid grid-rows-7 grid-flow-col gap-1 create">
        {/* Header */}
        <div className="row-start-1"></div>

        {/* Meeting Title and Attendees */}
        <div className="row-start-2 col-start-2 col-span-4 text-5xl text-bold meetingName">
          {meeting.name}
        </div>

        {/* Start/Stop Meeting buttons */}
        <div className="row-start-2 col-start-5 mt-5">
          {meetingStatus ? (
            <input
              type="submit"
              value="End Meeting"
              className="mx-auto py-2 px-4 rounded meetingButton"
              onClick={() => handleNotes()}
              onClick={() => sendMail()}
            ></input>
          ) : (
            <input
              type="submit"
              value="Start Meeting"
              className="mx-auto  py-2 px-4 rounded meetingButton"
              onClick={() => hideVotes()}
              onClick={() => setMeetingStatus(true)}
            ></input>
          )}
        </div>
        <div className="row-start-2 col-start-4 mt-5">
          <input
            type="submit"
            value="Return to User"
            className="mx-auto py-2 px-4 rounded meetingButton"
            onClick={() => returnBack()}
          ></input>
        </div>
        <div className="row-start-2 col-start-8 col-span-2 text-3xl meetingName text-center flex content-center justify-center mt-5">
          Attendees
        </div>

        {/* Outcome */}
        <div className="row-start-3 col-start-2 col-span-4 text-xl outcomeBg">
          <div className="font-bold text-xl mind_crawl text-white pl-3">
            Outcome:
          </div>
          <div className="border border-solid p-5 shadow-xl rounded">
            <div className="p-1 bg-white rounded">{meeting.outcome}.</div>
          </div>
        </div>

        {/* BAE Items */}
        <div className="row-start-5 col-start-2 col-span-4 pt-2 text-xl outcomeBg">
          <div className="font-bold mind_crawl text-white pl-3">BAE items:</div>
          <div className="">
            {meeting.agenda ? (
              <div className="rounded border border-solid shadow-xl p-5">
                {meeting.agenda.map(agenda => {
                  if (agenda.vote < 0) {
                    return (
                      <BAE
                        agenda={agenda}
                        attendees={attendees}
                        key={agenda._id}
                        handleDownVote={handleDownVote}
                        handleUpVote={handleUpVote}
                        tasks={agenda.tasks}
                      ></BAE>
                    );
                  }
                })}
              </div>
            ) : (
              <>
                <div>No meeting agenda has been set!</div>
              </>
            )}
          </div>
        </div>

        {/* Agenda and tasks */}
        <div className="row-start-4 col-start-2 col-span-4 pt-2 text-xl outcomeBg">
          <div className="font-bold mind_crawl text-white pl-3">Agenda:</div>
          {meeting.agenda ? (
            <div className="rounded border border-solid shadow-xl p-5">
              {meeting.agenda.map(agenda => {
                // console.log(agenda);
                if (agenda.vote >= 0) {
                  return (
                    <Agenda
                      agenda={agenda}
                      key={agenda._id}
                      handleDownVote={handleDownVote}
                      handleUpVote={handleUpVote}
                      handleTask={handleTask}
                      tasks={agenda.tasks}
                      attendees={attendees}
                      addUserTask={addUserTask}
                      userTaskName={userTaskName}
                      inputRef={inputRef}
                      agendaInputValue={agendaInputValue}
                    ></Agenda>
                  );
                }
              })}
            </div>
          ) : (
            <>
              <div>No meeting agenda has been set!</div>
            </>
          )}
        </div>

        {/* WYSIWYG Meeting Notes */}
        <div className="row-start-6 row-end-6 col-start-2 col-span-4 text-xl">
          <div className="font-bold mind_crawl text-white pl-3">Notes:</div>
          <div className="p-2">
            <Editor
              apiKey="avgvd7u4i68a9mq24lbgo9zusv5tq1vyu4pw9xrjkt9depds"
              initialValue="<p>This is the initial content of the editor</p>"
              id="notes"
              init={{
                height: 200,
                menubar: false,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar:
                  'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'
              }}
              onEditorChange={handleEditorChange}
            />
          </div>
          <div>
            <Speech></Speech>
          </div>
        </div>

        {/* Attendees column */}
        <div className="row-start-3 row-span-4 col-start-8 col-span-1 pr-2">
          {meeting.users ? (
            <>
              {attendees.map(attendee => {
                return (
                  <AttendeeCard
                    key={attendee._id}
                    attendee={attendee}
                  ></AttendeeCard>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </div>

        <textarea id="myText" className="hideSurvey">
          Thank you for your attendance. I would appreciate your feedback in
          order to improve our meetings. Please follow the link to the fill out
          a 5 question survey. https://www.surveymonkey.com/r/Y2YW3FQ
        </textarea>
      </div>
    </>
  );
}

export default Meeting;
