#F12::
Send ^{End}
Sleep, 500
Loop 100 {
    Send {Esc}{Enter}
    Sleep, 5
    Send aa bb
    Sleep, 5
}
Sleep, 1000
Loop 99 {
    Send +{Up}
    Sleep, 5
}
Send, +{Home}
Sleep, 500
Send {BS}
Send {BS}
return
