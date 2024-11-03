CREATE DATABASE falcon;
USE falcon;

CREATE TABLE User(
    userID INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(25),
    lastName  VARCHAR(25),
	username  VARCHAR(50)  UNIQUE,
    phone     VARCHAR(14)  UNIQUE,
    email     VARCHAR(100) UNIQUE,
    password  VARCHAR(255) , 
    confirmPassword VARCHAR(255) ,
    avatarURL       VARCHAR(255),
    avatarPublicId VARCHAR(255),
    country        VARCHAR(50), 
    state          VARCHAR(50),   
    city           VARCHAR(50),
    gender         VARCHAR(50),
    birthday       DATE,
    description    TEXT,   
    auctionBid     DECIMAL(10, 2), 
    
	role         enum('user','role'),
    signupWay    varchar(25) ,
    isVerified   boolean DEFAULT 0,
    
    googleToken  varchar(255),
    otp          varchar(255),
    otpCount     integer,
    otpLimit      integer,
    otpExpires    datetime,
    passChangedAt datetime,
    passResetToken VARCHAR(255),
    passResetExpires datetime
);

CREATE TABLE Identity(
    identityID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    cardImageURL VARCHAR(255), 
    selfieImageURL VARCHAR(255),
    Verification enum('approved', 'refused', 'pending', 'review'),
    FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE Falcon(
    FalconID INT PRIMARY KEY AUTO_INCREMENT,
    ownerID INT,
    name VARCHAR(100) ,
    description TEXT,
    category VARCHAR(50) ,
    price DECIMAL(10,2) ,
    state VARCHAR(50),    
    city VARCHAR(50),      
    color VARCHAR(50), 
    images JSON,    
    -- mediaURL VARCHAR(255) ,
    -- mediaPublicId VARCHAR(255),

    conditionOfUse ENUM('New', "Used", "Light Used","Like New"),
    communicationMethod ENUM("Chat","Mobile phone", "Both"),
    status ENUM('Running', 'Expired') DEFAULT 'Running',     

    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerID) REFERENCES User(userID)
);

CREATE TABLE Post(
    postID INT PRIMARY KEY AUTO_INCREMENT,
    userID INT,
    content VARCHAR(255),
    images json,
	privacy ENUM('Public', 'Private') DEFAULT 'Public',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE Event(
    eventID INT PRIMARY KEY AUTO_INCREMENT,
    ownerID INT,
    name VARCHAR(100),
    description TEXT,
    startDate DATE ,
    endDate DATE ,
    startTime TIME,
    endTime TIME ,
    country VARCHAR(50) ,
    state VARCHAR(50) ,  
    city VARCHAR(50) ,    
    privacy ENUM('Public', 'Private') DEFAULT 'Public',
    attendanceLimit INT,
    ticketPrice DECIMAL(10, 2),
    mediaURL VARCHAR(255), 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerID) REFERENCES User(userID)
);

CREATE TABLE EventAttendee(
    eventID INT,
    userID INT,
    attendanceStatus ENUM('Interested', 'Going'),
    PRIMARY KEY (eventID, userID),
    FOREIGN KEY (eventID) REFERENCES Event(eventID),
    FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE Ticket(
    ticketID INT PRIMARY KEY AUTO_INCREMENT,
    eventID INT,
    userID INT,
    noTickets INT  DEFAULT 1,
    attendantName VARCHAR(255) ,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventID) REFERENCES Event(eventID),
    FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE Comment(
    commentID INT PRIMARY KEY AUTO_INCREMENT,
    postID INT,
    eventID INT,
    userID INT,
    content VARCHAR(255) ,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES User(userID),
    FOREIGN KEY (postID) REFERENCES Post(postID),
    FOREIGN KEY (eventID) REFERENCES Event(eventID)
);

CREATE TABLE Likes (
    likeID INT PRIMARY KEY AUTO_INCREMENT,
    postID INT,
    commentID INT,
    userID INT,
    FOREIGN KEY (userID) REFERENCES User(userID),
    FOREIGN KEY (postID) REFERENCES Post(postID),
    FOREIGN KEY (commentID) REFERENCES Comment(commentID)
);

CREATE TABLE Friendship (
    friendshipID INT PRIMARY KEY AUTO_INCREMENT,
    userID1 INT,
    userID2 INT,
    isApproval BOOLEAN,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID1) REFERENCES User(userID),
    FOREIGN KEY (userID2) REFERENCES User(userID)
);

CREATE TABLE Follow (
    followerID INT,  
    followedID INT,    
    PRIMARY KEY (followerID, followedID),
    FOREIGN KEY (followerID) REFERENCES User(userID),
    FOREIGN KEY (followedID) REFERENCES User(userID)
);

CREATE TABLE Group_(
    groupID INT PRIMARY KEY AUTO_INCREMENT,
    creatorID INT,
    name VARCHAR(255),
    description TEXT,
	privacy ENUM('Public', 'Private') DEFAULT 'Public',
    isHidden BOOLEAN,
    FOREIGN KEY (creatorID) REFERENCES User(userID)
);

CREATE TABLE GroupMember (
    groupID INT,
    userID INT,
    PRIMARY KEY (groupID, userID), 
    FOREIGN KEY (groupID) REFERENCES Group_(groupID),
    FOREIGN KEY (userID) REFERENCES User(userID)
);

CREATE TABLE Message (
    messageID INT PRIMARY KEY AUTO_INCREMENT,
    senderID INT,
    receiverID INT,
    content VARCHAR(255),
    mediaURL VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderID) REFERENCES User(userID),
    FOREIGN KEY (receiverID) REFERENCES User(userID)
);

CREATE TABLE Notifications (
    notificationID INT PRIMARY KEY AUTO_INCREMENT,
    receiverID INT,
    content VARCHAR(255) ,
    isRead BOOLEAN DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (receiverID) REFERENCES User(userID)
);

CREATE TABLE Auction (
    auctionID INT PRIMARY KEY AUTO_INCREMENT,
    ownerID INT,
    winnerID INT,
    productName VARCHAR(255),
    description TEXT,
    category VARCHAR(50) ,
    subCategory VARCHAR(50),
    price DECIMAL(10,2),
    startTime TIME,
    endTime TIME,
    mediaURL VARCHAR(255),
    maxBid DECIMAL(10, 2), 
    minBid DECIMAL(10, 2), 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (winnerID) REFERENCES User(userID),
    FOREIGN KEY (ownerID) REFERENCES User(userID)
);

CREATE TABLE AuctionParticipant (
    auctionID INT,
    userID INT,
    PRIMARY KEY (auctionID, userID),
    FOREIGN KEY (auctionID) REFERENCES Auction(auctionID),
    FOREIGN KEY (userID) REFERENCES User(userID)
);

select * from users