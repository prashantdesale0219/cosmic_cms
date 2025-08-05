import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  IconButton,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { mediaService } from '../../services/api';
import { toast } from 'react-hot-toast';

const PanIndiaPresenceCMS = () => {
  // Get api from AuthContext
  const { api } = useContext(AuthContext);
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // General data state
  const [panIndiaData, setPanIndiaData] = useState({
    title: 'Pan India Presence',
    description: 'Our growing network spans across India, providing reliable solar solutions to homes and businesses nationwide.',
    totalStates: 25,
    statesDescription: 'Serving customers across more than 25 states with dedicated local support teams.',
    totalCities: 100,
    citiesDescription: 'Operating in over 100 cities with installation and maintenance capabilities.',
    totalProjects: 1000,
    projectsDescription: 'Successfully completed over 1000 solar installations of various scales nationwide.',
    mapImage: '/mapindea.png',
    isActive: true
  });
  
  // Locations state
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: '',
    region: 'North India',
    coordinates: {
      lat: '',
      lng: ''
    },
    isActive: true
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Media Library States
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [totalMediaPages, setTotalMediaPages] = useState(1);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPanIndiaData();
  }, []);

  // Check for selected map image in localStorage
  useEffect(() => {
    const selectedMapImage = localStorage.getItem('selectedMapImage');
    if (selectedMapImage) {
      // Update the state with the selected map image
      setPanIndiaData(prev => ({
        ...prev,
        mapImage: selectedMapImage
      }));
      
      // Show success message
      setSuccess('Map image selected successfully!');
      setSnackbarOpen(true);
      
      // Clear the localStorage item
      localStorage.removeItem('selectedMapImage');
    }
  }, []);

  // Fetch media files for the media library
  const fetchMediaFiles = async () => {
    setIsLoadingMedia(true);
    try {
      const response = await mediaService.getMedia(mediaPage, 12);
      setMediaFiles(response.data.data);
      setTotalMediaPages(response.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching media files:', err);
      toast.error('Failed to load media files');
    } finally {
      setIsLoadingMedia(false);
    }
  };

  // Handle media page change
  const handleMediaPageChange = (newPage) => {
    setMediaPage(newPage);
  };

  // Handle media selection
  const handleMediaSelect = (url) => {
    setPanIndiaData(prev => ({
      ...prev,
      mapImage: url
    }));
    setShowMediaLibrary(false);
    toast.success('Map image selected successfully!');
  };

  useEffect(() => {
    if (showMediaLibrary) {
      fetchMediaFiles();
    }
  }, [showMediaLibrary, mediaPage]);

  const fetchPanIndiaData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/pan-india-presence');
      if (response.data.success && response.data.data) {
        setPanIndiaData(response.data.data);
        setLocations(response.data.data.locations || []);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching Pan India data:', err);
      if (err.response && err.response.status === 404) {
        // If data doesn't exist yet, we'll create it when saving
        setError(null);
      } else {
        setError('Failed to fetch Pan India data. Please try again.');
        setSnackbarOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Function to handle media selection
  useEffect(() => {
    // Listen for messages from the media library window
    const handleMediaSelection = (event) => {
      // Check if the message is from our media library window
      if (event.data && event.data.type === 'MEDIA_SELECTED') {
        // Update the mapImage with the selected media URL
        setPanIndiaData(prev => ({
          ...prev,
          mapImage: event.data.url
        }));
        
        // Show success message
        setSuccess('Map image selected successfully!');
        setSnackbarOpen(true);
      }
    };

    // Add event listener
    window.addEventListener('message', handleMediaSelection);

    // Clean up
    return () => {
      window.removeEventListener('message', handleMediaSelection);
    };
  }, []);

  // General data handlers
  const handleGeneralInputChange = (e) => {
    const { name, value } = e.target;
    setPanIndiaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setPanIndiaData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target;
    setPanIndiaData(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };

  const saveGeneralData = async () => {
    setLoading(true);
    try {
      const response = await api.post('/pan-india-presence', panIndiaData);
      setSuccess('Pan India presence data saved successfully!');
      setSnackbarOpen(true);
      setPanIndiaData(response.data.data);
    } catch (err) {
      console.error('Error saving Pan India data:', err);
      setError('Failed to save Pan India data. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Location handlers
  const handleLocationInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'lat' || name === 'lng') {
      setNewLocation(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: parseFloat(value) || 0
        }
      }));
    } else {
      setNewLocation(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLocationSwitchChange = (e) => {
    const { name, checked } = e.target;
    setNewLocation(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const resetLocationForm = () => {
    setNewLocation({
      name: '',
      region: 'North India',
      coordinates: {
        lat: '',
        lng: ''
      },
      isActive: true
    });
    setEditMode(false);
    setCurrentId(null);
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editMode && currentId) {
        await api.put(`/pan-india-presence/locations/${currentId}`, newLocation);
        setSuccess('Location updated successfully!');
      } else {
        await api.post('/pan-india-presence/locations', newLocation);
        setSuccess('Location added successfully!');
      }

      setSnackbarOpen(true);
      resetLocationForm();
      fetchPanIndiaData(); // Refresh all data
    } catch (err) {
      console.error('Error saving location:', err);
      setError('Failed to save location. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = (id) => {
    const locationToEdit = locations.find(loc => loc._id === id);
    if (locationToEdit) {
      setNewLocation({
        name: locationToEdit.name || '',
        region: locationToEdit.region || 'North India',
        coordinates: {
          lat: locationToEdit.coordinates?.lat || 0,
          lng: locationToEdit.coordinates?.lng || 0
        },
        isActive: locationToEdit.isActive !== undefined ? locationToEdit.isActive : true
      });
      setEditMode(true);
      setCurrentId(id);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      setLoading(true);
      try {
        await api.delete(`/pan-india-presence/locations/${id}`);
        setSuccess('Location deleted successfully!');
        setSnackbarOpen(true);
        fetchPanIndiaData(); // Refresh all data
      } catch (err) {
        console.error('Error deleting location:', err);
        setError('Failed to delete location. Please try again.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSuccess(null);
    setError(null);
  };

  // DataGrid columns for locations
  const columns = [
    { field: 'name', headerName: 'Location Name', flex: 1 },
    { field: 'region', headerName: 'Region', flex: 1 },
    { 
      field: 'coordinates', 
      headerName: 'Coordinates', 
      flex: 1,
      valueGetter: (params) => {
        const lat = params.row.coordinates?.lat || 0;
        const lng = params.row.coordinates?.lng || 0;
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    },
    { 
      field: 'isActive', 
      headerName: 'Active', 
      flex: 0.5,
      renderCell: (params) => (
        <Box sx={{ color: params.row.isActive ? 'success.main' : 'error.main' }}>
          {params.row.isActive ? 'Yes' : 'No'}
        </Box>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditLocation(params.row._id)}
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDeleteLocation(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pan India Presence Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="General Information" />
          <Tab label="Locations" />
        </Tabs>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : "success"} sx={{ width: '100%' }}>
          {error || success}
        </Alert>
      </Snackbar>

      {/* General Information Tab */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Pan India Presence Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={panIndiaData.title}
                onChange={handleGeneralInputChange}
                variant="outlined"
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={panIndiaData.description}
                onChange={handleGeneralInputChange}
                variant="outlined"
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    States Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="Total States"
                    name="totalStates"
                    type="number"
                    value={panIndiaData.totalStates}
                    onChange={handleNumberInputChange}
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="States Description"
                    name="statesDescription"
                    value={panIndiaData.statesDescription}
                    onChange={handleGeneralInputChange}
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cities Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="Total Cities"
                    name="totalCities"
                    type="number"
                    value={panIndiaData.totalCities}
                    onChange={handleNumberInputChange}
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Cities Description"
                    name="citiesDescription"
                    value={panIndiaData.citiesDescription}
                    onChange={handleGeneralInputChange}
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Projects Information
                  </Typography>
                  <TextField
                    fullWidth
                    label="Total Projects"
                    name="totalProjects"
                    type="number"
                    value={panIndiaData.totalProjects}
                    onChange={handleNumberInputChange}
                    variant="outlined"
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Projects Description"
                    name="projectsDescription"
                    value={panIndiaData.projectsDescription}
                    onChange={handleGeneralInputChange}
                    variant="outlined"
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Map & Settings
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Map Image Path"
                      name="mapImage"
                      value={panIndiaData.mapImage}
                      onChange={handleGeneralInputChange}
                      variant="outlined"
                      margin="normal"
                      helperText="Path to the map image or select from media"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ ml: 1, mt: 2, height: 56 }}
                      onClick={() => {
                        setShowMediaLibrary(true);
                        setMediaPage(1);
                      }}
                    >
                      Select Media
                    </Button>
                  </Box>
                  {panIndiaData.mapImage && (
                    <Box sx={{ mt: 2, mb: 2 }}>
                      <img 
                        src={panIndiaData.mapImage} 
                        alt="Map Preview" 
                        style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} 
                      />
                    </Box>
                  )}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={panIndiaData.isActive}
                        onChange={handleSwitchChange}
                        name="isActive"
                        color="primary"
                      />
                    }
                    label="Active"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={saveGeneralData}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Locations Tab */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {editMode ? 'Edit Location' : 'Add New Location'}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box component="form" onSubmit={handleLocationSubmit} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Location Name"
                  name="name"
                  value={newLocation.name}
                  onChange={handleLocationInputChange}
                />
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="region-label">Region</InputLabel>
                  <Select
                    labelId="region-label"
                    id="region"
                    name="region"
                    value={newLocation.region}
                    label="Region"
                    onChange={handleLocationInputChange}
                  >
                    <MenuItem value="North India">North India</MenuItem>
                    <MenuItem value="South India">South India</MenuItem>
                    <MenuItem value="East India">East India</MenuItem>
                    <MenuItem value="West India">West India</MenuItem>
                    <MenuItem value="Central India">Central India</MenuItem>
                  </Select>
                </FormControl>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      id="lat"
                      label="Latitude"
                      name="lat"
                      type="number"
                      value={newLocation.coordinates.lat}
                      onChange={handleLocationInputChange}
                      inputProps={{ step: 'any' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      id="lng"
                      label="Longitude"
                      name="lng"
                      type="number"
                      value={newLocation.coordinates.lng}
                      onChange={handleLocationInputChange}
                      inputProps={{ step: 'any' }}
                    />
                  </Grid>
                </Grid>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={newLocation.isActive}
                      onChange={handleLocationSwitchChange}
                      name="isActive"
                      color="primary"
                    />
                  }
                  label="Active"
                  sx={{ mt: 2 }}
                />
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                  {editMode && (
                    <Button
                      variant="outlined"
                      onClick={resetLocationForm}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : (editMode ? <SaveIcon /> : <AddIcon />)}
                    sx={{ ml: editMode ? 2 : 'auto' }}
                  >
                    {editMode ? 'Update Location' : 'Add Location'}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                All Locations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ height: 500, width: '100%' }}>
                {loading && !locations.length ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <DataGrid
                    rows={locations.map(loc => ({ ...loc, id: loc._id }))}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    disableSelectionOnClick
                    autoHeight
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Media Library Modal */}
      <Dialog
        open={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        maxWidth="md"
        fullWidth
      >
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Media Library</Typography>
        <IconButton onClick={() => setShowMediaLibrary(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent>
      {isLoadingMedia ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            {mediaFiles.map((media) => (
              <Grid item xs={6} sm={4} md={3} key={media._id}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 150,
                    border: '1px solid #eee',
                    borderRadius: 1,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover .media-overlay': {
                      opacity: 1,
                    },
                  }}
                  onClick={() => handleMediaSelect(media.url)}
                >
                  <img
                    src={media.url}
                    alt={media.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    className="media-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <Button variant="contained" size="small">
                      Select
                    </Button>
                  </Box>
                </Box>
                <Typography variant="caption" noWrap>
                  {media.name}
                </Typography>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              disabled={mediaPage === 1}
              onClick={() => handleMediaPageChange(mediaPage - 1)}
            >
              Previous
            </Button>
            <Typography variant="body2" sx={{ mx: 2, alignSelf: 'center' }}>
              Page {mediaPage} of {totalMediaPages}
            </Typography>
            <Button
              disabled={mediaPage >= totalMediaPages}
              onClick={() => handleMediaPageChange(mediaPage + 1)}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setShowMediaLibrary(false)}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
    </Container>
  );
};

export default PanIndiaPresenceCMS;