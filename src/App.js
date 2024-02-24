import React, { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const App = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isAddfriend, setIsAddFriend] = useState(false);
  const [friendsList, setFriendList] = useState(initialFriends);
  function addFriend(friend) {
    setFriendList((friends) => [...friendsList, friend]);
    setIsAddFriend(false);
  }
  function selectFriend(friend) {
    if (friend === selectedFriend) setSelectedFriend(null);
    else setSelectedFriend(friend);
    setIsAddFriend(false);
  }
  function billSplit(value) {
    console.log(value);
    setFriendList((friendsList) =>
      friendsList.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <SideBar
        onselectFriend={selectFriend}
        selectedFriend={selectedFriend}
        setIsAddFriend={setIsAddFriend}
        isAddfriend={isAddfriend}
        friendsList={friendsList}
        addFriend={addFriend}
      />
      <div>
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onbillSplit={billSplit}
          />
        )}
      </div>
    </div>
  );
};

export default App;
function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function SideBar({
  onselectFriend,
  selectedFriend,
  setIsAddFriend,
  isAddfriend,
  friendsList,
  addFriend,
}) {
  return (
    <div className="sidebar">
      <ul>
        {friendsList.map((friend) => (
          <FriendList
            friend={friend}
            onselectFriend={onselectFriend}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
      {selectedFriend === null && (
        <Button onClick={() => setIsAddFriend(!isAddfriend)}>Add friend</Button>
      )}
      <div>{isAddfriend && <AddFriendForm onAddFriend={addFriend} />}</div>
    </div>
  );
}

function FriendList({ onselectFriend, friend, selectedFriend }) {
  const isSelected = friend === selectedFriend;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 ? (
        <p className="red">{`you ows ${friend.name} ${Math.abs(
          friend.balance
        )}`}</p>
      ) : (
        <p className="green">{`${friend.name} owe you ${friend.balance}`}</p>
      )}

      <Button onClick={() => onselectFriend(friend)}>
        {!isSelected ? "open" : "close"}
      </Button>
    </li>
  );
}

function AddFriendForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    if (!name || !image) return;
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `S{image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL</label>
      <input
        type="text"
        placeholder="img url"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onbillSplit }) {
  const [Bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    onbillSplit(whoIsPaying === "user" ? Bill - paidByUser : -paidByUser);
  }
  return (
    <div>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>Split a bill with {selectedFriend.name}</h2>
        <label>Bill Value</label>
        <input
          type="number"
          value={Bill}
          onChange={(e) => setBill(e.target.value)}
        />
        <label>Youre expense</label>
        <input
          type="number"
          value={paidByUser}
          onChange={(e) =>
            setPaidByUser(e.target.value > Bill ? paidByUser : e.target.value)
          }
        />
        <label>{selectedFriend.name} expenses</label>

        <input type="number" value={Bill - paidByUser} disabled />
        <label>Who is paying the bill</label>
        <select onChange={(e) => setWhoIsPaying(e.target.value)}>
          <option value="user">You</option>
          <option value={selectedFriend.name}>{selectedFriend.name}</option>
        </select>
        <Button>split bill</Button>
      </form>
    </div>
  );
}
