const hamburguesa = document.getElementById('hamburger');
const enlaces = document.querySelector('.nav-links');

hamburguesa.addEventListener('click', () => {
    enlaces.classList.toggle('show');
});

const currentYear = new Date().getFullYear();
document.getElementById('currentyear').textContent = currentYear;
document.getElementById('lastModified').textContent = document.lastModified;

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courses = document.querySelectorAll('.course');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            courses.forEach(course => {
                if (filter === 'all') {
                    course.style.display = 'block';
                } else {
                    if (course.classList.contains(filter)) {
                        course.style.display = 'block';
                    } else {
                        course.style.display = 'none';
                    }
                }
            });
        });
    });
});