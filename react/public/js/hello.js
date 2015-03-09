var CommentBox = React.createClass({displayName: "CommentBox",
    render: function() {
        return (
            React.createElement("div", {className: "commentBox"}, 
                "Hello, world! I am commentbox."
            )
        );
    }
})

React.render(
    React.createElement(CommentBox, null),
    document.getElementById('content')
);
