# Core Memories Feature - Quick Test Guide

## Quick Start Testing

### Prerequisites
- Dev server running on port 3001
- User authenticated (logged in to planner)
- Database initialized with `core_memories` table

### Test 1: Add a Memory (Daily View)
**Expected Result**: Memory saved and appears in list

1. Navigate to `/planner`
2. Scroll to "Core Memories" section at the bottom
3. Click "Daily View" button (should be highlighted blue)
4. Click "Add Memory" button (collapsible header)
5. Fill in form:
   - Title: "My First Memory"
   - Description: "This is a test memory"
   - Date: "2024-01-15" (or today's date)
   - Tags: "test, personal" (comma-separated)
6. Click "Save Memory"
7. **✅ PASS**: Memory appears in list below with all details

### Test 2: Memory Appears in Daily List
**Expected Result**: Memory shows with title, description, date, and tags

1. In the daily view, check the memory list
2. **✅ PASS**: You see:
   - Memory title as card header
   - Description text
   - Date in format
   - Tag pills with blue background
   - Delete button (×)

### Test 3: Switch to Timeline View
**Expected Result**: Memory appears grouped by year with timeline visualization

1. Click "Timeline View" button
2. **✅ PASS**: You see:
   - Timeline visualization with year badges
   - Memory date grouping (if from same year)
   - Visual timeline connectors
   - Delete buttons still available

### Test 4: Tag Filtering in Timeline
**Expected Result**: Can filter memories by tag

1. In Timeline View, look for tag filter buttons
2. **✅ PASS**: 
   - "All" button shows all memories
   - Click "test" button shows only memories with "test" tag
   - Click "personal" button shows only "personal" tag memories
   - Click "All" again to reset

### Test 5: Delete Memory
**Expected Result**: Memory removed immediately from UI and database

1. In either view, find the memory from Test 1
2. Click the delete button (×)
3. **✅ PASS**: 
   - Memory disappears from list immediately
   - Message appears: "✅ Memory deleted"

### Test 6: Refresh Page to Verify Persistence
**Expected Result**: Memory remains deleted after page refresh

1. Refresh the page (⌘+R or Ctrl+R)
2. **✅ PASS**: 
   - Remaining memories still appear
   - Deleted memory does not return
   - All data persisted to database

### Test 7: Add Multiple Memories from Different Years
**Expected Result**: Timeline groups by year correctly

1. Add memory from 2023: "2023-06-15"
2. Add memory from 2024: "2024-12-25"
3. Add memory from 2022: "2022-03-10"
4. Switch to Timeline View
5. **✅ PASS**: 
   - Memories grouped by year (2022, 2023, 2024)
   - Years displayed in chronological order
   - Newest memories first within each year

### Test 8: Tag Filtering with Multiple Memories
**Expected Result**: Filter buttons correctly show/hide memories

1. Add 3 memories with tags:
   - Memory 1: tags = ["work", "achievement"]
   - Memory 2: tags = ["personal", "achievement"]
   - Memory 3: tags = ["travel", "fun"]
2. In Timeline View, click "achievement" filter
3. **✅ PASS**: Only Memory 1 and 2 appear
4. Click "work" filter
5. **✅ PASS**: Only Memory 1 appears
6. Click "All" to reset

### Test 9: Edge Cases

#### Empty Tags
1. Add memory without tags (leave empty)
2. **✅ PASS**: Memory saves successfully
3. No tag pills appear on memory card

#### Special Characters
1. Add memory with title: "Mom's Birthday! 🎉"
2. Description with special chars: "Celebrated @ The Restaurant & Spa!"
3. **✅ PASS**: All characters display correctly

#### Long Description
1. Add memory with very long description (500+ chars)
2. **✅ PASS**: Description displays wrapped/scrollable

#### Future Date
1. Add memory with future date
2. **✅ PASS**: Memory appears in timeline normally

### Test 10: UI/UX Checks

- [ ] Buttons are clickable and have hover states
- [ ] Forms are responsive on mobile
- [ ] Timeline visualization is readable
- [ ] Error messages appear for failed saves
- [ ] Success messages appear for saves
- [ ] Date picker works correctly
- [ ] Tag input accepts comma-separated values

## Debugging Tips

### Check Dev Console (F12)
Look for messages like:
- `✅ Memory saved` - Success
- `✅ Memory deleted` - Deletion success
- Error messages if API fails

### Check Network Tab (F12 → Network)
- POST to `/api/memories` - Creating memory
- GET to `/api/memories` - Loading memories
- DELETE to `/api/memories/[id]` - Deleting memory

### Database Check
If memories don't persist after refresh:
```bash
# SSH to database and check table
psql -U mindful_user -d mindful_dev -c "SELECT * FROM core_memories;"
```

## Reporting Issues

If tests fail, include:
1. **Error message** from console
2. **Network response** from browser DevTools
3. **Step to reproduce** the issue
4. **Expected vs actual** behavior
5. **Screenshot** if UI looks wrong

## Success Criteria ✅

All tests pass when:
- [x] Memories persist to database
- [x] Memories load on page refresh
- [x] Timeline groups by year correctly
- [x] Tag filtering works
- [x] Delete removes memory permanently
- [x] No JavaScript errors in console
- [x] API endpoints return correct status codes

---

**Estimated Test Time**: 5-10 minutes for all tests
**Difficulty**: Easy - just interact with UI and verify it works

Happy testing! 🎉
